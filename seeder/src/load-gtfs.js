import * as gtfs from 'gtfs';
import unzip from 'node-stream-zip';
import readline from 'readline';
import axios from 'axios';
import progress from 'progress';
import { default as temp } from 'temp';

const load = (agency) => {
    return new Promise(async resolve => {   
        temp.track();
        let archive = await downloadArchive(agency);
        
        const database = await readArchive(archive);
        let [ stops, routes ] = await loadPartialDataset(database);
        
        await Promise.all(routes.map(async route => {
            route.route_shapes = await assembleRouteShape(database, route.route_id);
        }));
        
        resolve({ stops, routes });
    });
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

const readArchive = archive => {
    return new Promise(async resolve => {
        console.log("Loading " + archive + " into memory...");
        
        // Extract zip to a temporary directory
        const zip = new unzip.async({ file: archive });
        
        const tables = Object.keys(await zip.entries());
        const promises = tables.map(table => new Promise(async resolve => {
            if (table == 'stop_times') { resolve(0); return; }
            
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
            agencies: [ { path: archive, exclude: [ 'stop_times' ] } ],
            logFunction: loaderTick
        };
        
        gtfs.importGtfs(config).then(() => resolve(config));
    });
};

const loadPartialDataset = async database => {
    await gtfs.openDb(database);
    
    // Show only rail stations and routes
    const stops = gtfs.getStops({ location_type: 1 });
    const routes = gtfs.getRoutes({ route_type: 1 });
    
    return Promise.all([ stops, routes ]);
};

const assembleRouteShape = async (database, route) => {
    await gtfs.openDb(database);
    return gtfs.getShapes({ route_id: route });
};

export { load };