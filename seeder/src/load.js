import * as gtfs from 'gtfs';
import unzip from 'node-stream-zip';
import readline from 'readline';
import axios from 'axios';
import progress from 'progress';
import { default as temp } from 'temp';
import * as turfUtils from '@turf/helpers';
import turfBounds from '@turf/bbox';
import turfBearing from '@turf/bearing';
import { diffArrays } from 'diff';

const vehicles = {
    "streetcar": 0,
    "light-rail": 0,
    "tram": 0,
    "subway": 1,
    "metro": 1,
    "rail": 2,
    "bus": 3,
    "ferry": 4,
    "cable-tram": 5,
    "aerial-lift": 6,
    "funicular": 7,
    "trolleybus": 11,
    "monorail": 12
};

export const load = async config => {
    temp.track();
    let archive = await downloadArchive(config);
    
    // Import to intermediate database and query for relevant data
    await readArchive(archive);
    let [ agencies, stops, routes ] = await loadPartialDataset(vehicles[config.vehicle], config.stations);
    
    // Reduce down to single agency based on config key
    let agency = (agencies.length == 1) ? agencies[0] :
        agencies.find(agency => agency.agency_id.toLowerCase() == config.id);
    
    agency.agency_id = config.id;
    
    // Remove routes that aren't associated with the agency
    if (agencies.length > 1) {
        routes = routes.filter(route => route.agency_id.toLowerCase() == config.id);
    }
    
    // Find each route's unique trips/stop sequence per direction
    for await (let route of routes) {
        route.route_directions = await associateRouteDirections(route, config.stations);
    }
    
    // Remove stops that are served by irrelevant vehicle types
    const served = new Set(routes.map(route => route.route_directions).flat(3));
    
    stops = stops.filter(stop => served.has(stop.stop_id));
    
    // Convert routes into branching format
    routes = routes.map(route => {
        route.route_directions = calculateRouteBranches(route.route_directions);
        route.route_directions = calculateDirectionHeadings(route.route_directions, stops);
        return route;
    });
    
    // Determine whether each stop is more or less important
    if (config.vehicle == "bus") {
        stops = await assignStopMajority(stops);
    }
    
    // Query for all shapes associated with every route
    for await (let route of routes) {
        route.route_shapes = await assembleRouteShape(route.route_id);
    }
    
    // Remove routes that have no trips associated with them
    routes = routes.filter(route => route.route_shapes.length);
    
    agency.agency_bounds = calculateAgencyBounds(routes);
    
    return { agency, stops, routes };
};

const downloadArchive = async config => {
    if (config.url) {
        console.log("Starting download of " + config.url + "...");
        
        const { data, headers } = await axios.get(config.url, { responseType: 'stream' });
        
        const factor = Math.pow(2, 20);
        let loader = new progress('Downloading [:bar] :rate/mbps :percent ',
            { width: 51, total: parseInt(headers['content-length']) / factor });
        
        data.on('data', chunk => {
            loader.tick(chunk.length / factor);
        });
        
        let stream = temp.createWriteStream({ suffix: ".zip" });
        await new Promise(resolve => {
            data.pipe(stream).on('finish', () => resolve());
        });
        
        return stream.path;
    } else if (config.path) {
        return config.path;
    } else {
        throw 'No agency URL or filename specified';
    }
};

const readArchive = async archive => {
    console.log("Loading " + archive + " into memory...");
    
    // Extract zip to a temporary directory
    const zip = new unzip.async({ file: archive });
    
    const tables = Object.keys(await zip.entries());
    const promises = tables.map(table => new Promise(async resolve => {
        let count = 0;
        const reader = readline.createInterface({
            input: await zip.stream(table)
        });
        reader.on('line', () => count++);
        reader.on('close', () => resolve(count));
    }));
    
    const totals = await Promise.all(promises);
    zip.close();
    
    // Combine line counts of all files
    const total = totals.reduce((previous, current) => previous + current);
    
    // Setup import loader and tick function based on log output
    let loader = new progress('Importing [:bar] :percent :etas remaining ',
        { width: 53, total: total });
        
    let prevCount = 0, prevFile = '';
    const loaderTick = text => {
        const words = text.split(' - ');
        if (loader.complete || words.length != 3) { return; }
        
        let count = words[2].match(/^(\d+)/);
        if (!count || !count.length) { return; } 
        
        count = parseInt(count[0]); let file = words[1];
        
        if (file != prevFile) { prevCount = 0; }
        loader.tick(count - prevCount);
        
        prevCount = count; prevFile = file;
    };
    
    // Do the GTFS/SQL importing
    let config = {
        agencies: [ { path: archive } ],
        logFunction: loaderTick
    };
    
    await gtfs.importGtfs(config);
};

const loadPartialDataset = async (vehicle, stations) => {
    // Show only rail stations and routes
    const agencies = gtfs.getAgencies({}, [ 'agency_id', 'agency_name', 'agency_url' ]);
    const stops = gtfs.getStops({ location_type: (stations) ? [ 1, 0, null ] : [ 0, null ] });
    const routes = gtfs.getRoutes({ route_type: vehicle });
    
    return Promise.all([ agencies, stops, routes ]);
};

const associateRouteDirections = async (route, stations) => {
    let trips = await gtfs.getTrips({ route_id: route.route_id }, [ 'trip_id', 'direction_id' ]);
    
    // Get stop sequence for each trip
    for await (let trip of trips) {
        let stops = await gtfs.getStoptimes({ trip_id: trip.trip_id }, [ 'stop_id' ], [[ 'stop_sequence', 'ASC' ]]);
        stops = stops.map(stop => stop.stop_id);
        
        if (stations) {
            stops = await gtfs.getStops({ stop_id: stops }, [ 'stop_id', 'parent_station' ]);
            stops = stops.map(stop => stop.parent_station ?? stop.stop_id);
        }
        
        trip.stops = stops;
    }
    
    // Group trips by direction id
    let directions = [];
    trips.forEach(trip => {
        directions[trip.direction_id] ??= [];
        
        const identicalTripExists = directions[trip.direction_id].some(existing => {
            return existing.length == trip.stops.length
                && existing.every(stop => trip.stops.includes(stop));
        });
        
        if (!identicalTripExists) {
            directions[trip.direction_id].push(trip.stops);
        }
    });
    
    for (const direction in directions) {
        if (directions[direction].length > 2) {
            console.warn("Import warning: Route '" + route.route_id + "' direction " + direction + " has more than one trip deviation.");
        }
    }
    
    return directions;
};

const calculateRouteBranches = directions => {
    return directions.map(trips => {
        if (trips.length == 1) {
            // This route-direction doesn't have any deviations
            return [[ trips[0] ]];
        }
        
        const diff = diffArrays(trips[0], trips[1]);
        
        let output = [], segment = [];
        diff.forEach(branch => {
            if (branch.added || branch.removed) {
                // For diverging route sections, create a branch set
                segment.push(branch.value);
            } else {
                // Concat branch set before adding following common section
                if (segment.length) {
                    output.push(segment);
                    segment = [];
                }
                
                output.push([ branch.value ]);
            }
        });
        
        if (segment.length) {
            // Route ends at separate destinations - append final branch set
            output.push(segment);
        }
        
        return output;
    });
};

const calculateDirectionHeadings = (directions, stops) => {
    directions = directions.map(segments => {
        const lastBranch = segments[segments.length - 1][0];
        const lastStop = stops.find(stop => stop.stop_id == lastBranch[lastBranch.length - 1]);
        const firstStop = stops.find(stop => stop.stop_id == segments[0][0][0]);
        
        const direction = Math.round(turfBearing(
            [ firstStop.stop_lon, firstStop.stop_lat ],
            [ lastStop.stop_lon, lastStop.stop_lat ]
        ) / 90);
        
        const heading = (direction == -2) ? 'south' :
            (direction == -1) ? 'west' :
            (direction == 0) ? 'north' :
            (direction == 1) ? 'east' : 
            (direction == 2) ? 'south' : false;
        
        // Wrap arrays into object format
        segments = segments.map(segment => ({
            branches: segment.map(branch => ({ stops: branch }))
        }));
        
        return { heading, segments };
    });
    
    directions.sort((a, b) => {
        const sortOrder = [
            'north', 'east', 'south', 'west'
        ];
        
        return sortOrder.indexOf(a.heading) - sortOrder.indexOf(b.heading);
    });
    
    return directions;
};

const assignStopMajority = async stops => {
    let timepoints = await gtfs.advancedQuery('stop_times', {
        query: {
            'stop_times.timepoint': 1
        },
        fields: [ 'stops.stop_id' ],
        join: [{
            type: 'INNER',
            table: 'stops',
            on: 'stop_times.stop_id=stops.stop_id'
        }]
    });
    
    // Reorganize to a flattened format
    timepoints = new Set(timepoints.map(timepoint => timepoint.stop_id));
    
    // Assign a boolean based on whether or not a stop has an exact timepoint
    stops.forEach(stop => {
        stop.is_major = timepoints.has(stop.stop_id);
    });
    
    return stops;
};

const assembleRouteShape = route => {
    return gtfs.getShapes({ route_id: route });
};

const calculateAgencyBounds = routes => {
    let points = [];
    routes.forEach(route => {
        points = points.concat(route.route_shapes.map(shape => {
            return turfUtils.point([ shape.shape_pt_lon, shape.shape_pt_lat ]);
        }));
    });

    const bounds = turfBounds(turfUtils.featureCollection(points));
    return [ bounds[0], bounds[3], bounds[2], bounds[1] ];
};