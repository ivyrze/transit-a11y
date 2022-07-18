import unzip from 'node-stream-zip';
import csv from 'csv-parser';
import axios from 'axios';
import progress from 'progress';
import { default as temp } from 'temp';

const load = (agency) => {
    return new Promise(async (resolve, error) => {   
        temp.track();
        let path = await downloadArchive(agency);
        
        readArchive(path).then((dataset) => {
            let { stops, routes, trips, shapes } = Object.fromEntries(dataset);
            
            [ stops, routes ] = slimDataset(stops, routes);
            
            routes.forEach(route => {
                route.route_shapes = assembleRouteShape(route.route_id, trips, shapes);
            });
            
            resolve({ stops, routes });
        });
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
            data.pipe(stream).on('close', () => {
                resolve(stream.path);
            });
        } else if (agency.path) {
            resolve(agency.path);
        } else {
            error('No agency URL or filename specified');
        }
    });
};

const readArchive = path => {
    console.log("Loading " + path + " into memory...");
    
    const zip = new unzip.async({ file: path });
    let promises = [];
    
    [ 'stops', 'routes', 'trips', 'shapes' ].forEach((table) => {
        promises.push(new Promise(async (resolve) => {
            const stream = await zip.stream(table + '.txt');
            
            let rows = [];
            stream
                .pipe(csv())
                .on('data', (data) => { rows.push(data); })
                .on('end', () => { resolve([ table, rows ]); });
        }));
    });
    
    const promise = Promise.all(promises);
    promise.then(() => { zip.close(); temp.cleanup(); });
    
    return promise;
};

const slimDataset = (stops, routes) => {
    // Show only rail stations and routes
    stops = stops.filter(stop => stop.location_type == 1);
    routes = routes.filter(route => route.route_type == 1);
    
    return [ stops, routes ];
};

const assembleRouteShape = (route, trips, shapes) => {
    let routeShapes = {};
    trips.forEach(trip => {
        // Collect each unique path that a given route takes
        if (trip.route_id == route && !routeShapes[trip.shape_id]) {
            routeShapes[trip.shape_id] = assembleShape(trip.shape_id, shapes);
        }
    });
    
    // Remove the keys that were used temporarily to prevent duplicates
    return Object.values(routeShapes);
};

const assembleShape = (id, shapes) => {
    let shape = [];
    shapes.forEach(point => {
        // Find specified shape in the dataset
        if (point.shape_id == id) {
            // Order the points by the saved sequence index
            shape[point.shape_pt_sequence] = {
                shape_pt_lon: point.shape_pt_lon,
                shape_pt_lat: point.shape_pt_lat
            };
        }
    });
    
    // Remove filler array indicies
    return shape.filter(point => point);
}

export { load };