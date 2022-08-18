import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { createClient } from 'redis';

import { clean } from './src/clean.js';
import { load } from './src/load.js';
import { store, indicies } from './src/store.js';
import { geojson } from './src/convert.js';
import { mapbox } from './src/upload.js';
import * as transformers from './src/transformers/index.js';

// Read config file
dotenv.config();
const config = JSON.parse(await readFile('seeder/config.json'));
const args = process.argv.slice(2);

// Create database connection
const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis client error', err));
await client.connect();

var cleanPromise = clean(client);

var importPromises = [];
config.agencies.forEach(agency => {
    importPromises.push(new Promise(async (resolve) => {
        let { stops, routes } = await load(agency);
        
        stops = stops.map(stop => transformers.idPrefixer(stop, agency.id)) // todo
        routes = routes.map(route => transformers.colorContinuity(route));
        
        // Config-specified transformations
        if (agency.transformations) {
            agency.transformations.forEach(transformation => {
                stops = stops.map(stop => {
                    return transformers[transformation.type](stop, transformation, 'stop_name');
                });
            });
        }
        
        // Store stops in Redis database
        cleanPromise.then(() => {
            store(client, stops, routes);
            resolve({ stops, routes });
        });
    }));
});

Promise.all(importPromises.concat(cleanPromise)).then((agencies) => {
    // Create indicies
    indicies(client).then(() => client.quit());
    
    // Respect short-circuit command line option
    if (args.includes('--skip-geojson')) {
        console.log("Skipping GeoJSON export and upload.");
        return;
    }
    
    // Merge the datasets from each agency into one
    let { stops, routes } = agencies.reduce((result, current) => {
        Object.keys(current ?? {}).forEach(key => {
            if (!result[key]) { result[key] = []; }
            result[key] = result[key].concat(current[key]);
        });
        return result;
    }, {});
    agencies = undefined;
    
    // Convert to GeoJSON and optionally upload to Mapbox
    const local = args.includes('--export-local');
    const stopsPromise = geojson('stops', stops, local);
    const routesPromise = geojson('routes', routes, local);
    
    if (!local) {
        stopsPromise.then(json => mapbox('transit-a11y-stops', json))
        routesPromise.then(json => mapbox('transit-a11y-routes', json))
    } else {
        Promise.all([ stopsPromise, routesPromise ]).then(() => {
            console.log("Exported GeoJSON to the project root directory.");
        });
    }
});