import * as gtfs from 'gtfs';
import unzip from 'node-stream-zip';
import readline from 'readline';
import axios from 'axios';
import progress from 'progress';
import { default as temp } from 'temp';
import * as turfUtils from '@turf/helpers';
import turfCenter from '@turf/center';

export const load = async config => {
    temp.track();
    let archive = await downloadArchive(config);
    
    // Import to intermediate database and query for relevant data
    await readArchive(archive);
    let [ agencies, stops, routes ] = await loadPartialDataset(config.vehicle);
    
    // Reduce down to single agency based on config key
    let agency = (agencies.length == 1) ? agencies[0] :
        agencies.find(agency => agency.agency_id.toLowerCase() == config.id);
    
    agency.agency_id = config.id;
    
    // Remove routes that aren't associated with the agency
    if (agencies.length > 1) {
        routes = routes.filter(route => route.agency_id.toLowerCase() == config.id);
    }
    
    // Set stops to be accessible by default
    stops.forEach(stop => stop.wheelchair_boarding = stop.wheelchair_boarding ?? 1);
    
    // Link stops to the routes that serve them
    stops = await associateStopsRoutes(stops, config.vehicle);
    
    // Remove stops that are served by irrelevant vehicle types
    stops = stops.filter(stop => stop.routes.length);
    
    // Query for all shapes associated with every route
    for await (let route of routes) {
        route.route_shapes = await assembleRouteShape(route.route_id);
    }
    
    agency.agency_center = calculateAgencyCenter(routes);
    
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

const loadPartialDataset = async vehicle => {
    // Show only rail stations and routes
    const agencies = gtfs.getAgencies({}, [ 'agency_id', 'agency_name', 'agency_url' ]);
    const stops = gtfs.getStops({ location_type: 1 });
    const routes = gtfs.getRoutes({ route_type: vehicle });
    
    return Promise.all([ agencies, stops, routes ]);
};

const associateStopsRoutes = async (stops, vehicle) => {
    let loader = new progress('Processing [:bar] :percent :etas remaining ',
        { width: 50, total: stops.length });
    
    for await (let stop of stops) {
        stop.routes = await associateStopRoutes(stop.stop_id, vehicle);
        loader.tick();
    }
    
    return stops;
};

const associateStopRoutes = async (stop, vehicle) => {
    let childStops = await gtfs.getStops({ parent_station: stop });
    
    const matches = await Promise.all(childStops.map(childStop =>
        gtfs.getRoutes(
            { stop_id: childStop.stop_id, route_type: vehicle },
            [ 'route_id', 'route_short_name', 'route_long_name', 'route_color' ]
        )
    ));
    
    // De-duplicate route-stop matches
    let routes = {};
    matches.flat().forEach(match => {
        routes[match.route_id] = match;
    });
    
    return Object.values(routes);
};

const assembleRouteShape = route => {
    return gtfs.getShapes({ route_id: route });
};

const calculateAgencyCenter = routes => {
    let points = [];
    routes.forEach(route => {
        points = points.concat(route.route_shapes.map(shape => {
            return turfUtils.point([ shape.shape_pt_lon, shape.shape_pt_lat ]);
        }));
    });
    
    return turfCenter(turfUtils.featureCollection(points)).geometry.coordinates;
};