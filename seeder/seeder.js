import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { createClient } from 'redis';

import { clean } from './src/clean-redis.js';
import { load } from './src/load-gtfs.js';
import { store } from './src/store-redis.js';
import { indicies } from './src/indicies-redis.js';
import { geojson } from './src/convert-geojson.js';
import { mapbox } from './src/upload-mapbox.js';
import * as transformers from './src/transformers/index.js';

// Read config file
dotenv.config();
const config = JSON.parse(await readFile('seeder/config.json'));

// Create database connection
const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis client error', err));
await client.connect();

var cleanPromise = clean(client);

var importPromises = [];
config.agencies.forEach(agency => {
    importPromises.push(new Promise(async (resolve) => {
        let { stops, routes } = await load(agency);
        
        stops = stops.map(stop => transformers.idPrefixer(stop, agency.id))
        routes = routes.map(route => transformers.colorContinuity(route));
        
        // Config-specified transformations
        agency.transformations.forEach(transformation => {
            stops = stops.map(stop => {
                return transformers[transformation.type](stop, transformation, 'stop_name');
            });
        });
        
        // Store stops in Redis database
        cleanPromise.then(() => {
            store(client, stops);
            resolve({ stops, routes });
        });
    }));
});

Promise.all(importPromises.concat(cleanPromise)).then((agencies) => {
    // Create indicies
    indicies(client).then(() => client.quit());
    
    // Merge the datasets from each agency into one
    let { stops, routes } = agencies.reduce((result, current) => {
        Object.keys(current ?? {}).forEach(key => {
            if (!result[key]) { result[key] = []; }
            result[key] = result[key].concat(current[key]);
        });
        return result;
    }, {});
    agencies = undefined;
    
    // Convert to GeoJSON and upload to Mapbox
    geojson('stops', stops).then(json => mapbox('transit-a11y-stops', json))
    geojson('routes', routes).then(json => mapbox('transit-a11y-routes', json))
});