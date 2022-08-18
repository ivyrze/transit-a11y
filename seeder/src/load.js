import * as gtfs from 'gtfs';
import unzip from 'node-stream-zip';
import readline from 'readline';
import axios from 'axios';
import progress from 'progress';
import { default as temp } from 'temp';

const load = async agency => {
    temp.track();
    let archive = await downloadArchive(agency);
    
    const database = await readArchive(archive);
    let [ stops, routes ] = await loadPartialDataset(database, agency.vehicle);
    
    for await (let stop of stops) {
        stop.routes = await associateStopsRoutes(database, stop.stop_id, agency.vehicle);
    }
    
    for await (let route of routes) {
        route.route_shapes = await assembleRouteShape(database, route.route_id);
    }
    
    return { stops, routes };
};

const downloadArchive = (agency) => {
    return new Promise(async (resolve, error) => {   
        if (agency.url) {
            console.log("Starting download of " + agency.url + "...");
            
            const { data, headers } = await axios(
                { url: agency.url, responseType: 'stream' });
            
            const factor = Math.pow(2, 20);
            let loader = new progress('Downloading [:bar] :rate/mbps :percent ',
                { total: parseInt(headers['content-length']) / factor });
            
            data.on('data', chunk => {
                loader.tick(chunk.length / factor);
            });
            
            let stream = temp.createWriteStream({ suffix: ".zip" });
            data.pipe(stream).on('finish', () => {
                resolve(stream.path);
            });
        } else if (agency.path) {
            resolve(agency.path);
        } else {
            error('No agency URL or filename specified');
        }
    });
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
    let loader = new progress('Importing [:bar] :percent :etas remaining ', { total });
        
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
    return config;
};

const loadPartialDataset = async (database, vehicle) => {
    await gtfs.openDb(database);
    
    // Show only rail stations and routes
    const stops = gtfs.getStops({ location_type: 1 });
    const routes = gtfs.getRoutes({ route_type: vehicle });
    
    return Promise.all([ stops, routes ]);
};

const associateStopsRoutes = async (database, stop, vehicle) => {
    await gtfs.openDb(database);
    
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

const assembleRouteShape = async (database, route) => {
    await gtfs.openDb(database);
    return gtfs.getShapes({ route_id: route });
};

export { load };