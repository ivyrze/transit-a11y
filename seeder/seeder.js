import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

import { clean } from './src/clean.js';
import { load } from './src/load.js';
import { extend } from './src/extend.js';
import { store, indicies } from './src/store.js';
import { geojson } from './src/convert.js';
import { mapbox } from './src/upload.js';

import * as transformers from './src/transformers/index.js';

// Read config file
dotenv.config();
const configs = JSON.parse(await readFile('seeder/config.json'));
const args = process.argv.slice(2);

// Create database connection
const client = createClient(redisOptions);
client.on('error', error => console.error(error));

await client.connect();

// Remove existing database data
await clean(client);

// Import and process GTFS data
const processAgency = async config => {
    let { agency, stops, routes } = await load(config);
    
    // Supplement with Sanity CMS data
    stops = await extend(stops, config.id);
    
    // General transformations
    stops = stops.map(stop => transformers.idPrefixer(stop, config.id));
    routes = routes.map(route => transformers.idPrefixer(route, config.id));
    routes = routes.map(route => transformers.colorContinuity(route));
    
    // Config-specified transformations
    config.transformations?.forEach(transformation => {
        const [ dataset, source ] = transformation.source.split('.');
        
        if (dataset == 'stops') {
            stops = stops.map(stop => transformers[transformation.type](stop, transformation, source));
        } else if (dataset == 'routes') {
            routes = routes.map(route => transformers[transformation.type](route, transformation, source));
        } else {
            throw 'Unrecognized transformation source provided';
        }
    });
    
    // Store stops in Redis database
    await store(client, agency, stops, routes);
    return { stops, routes };
};

let datasets = [];
for await (let config of configs.agencies) {
    datasets.push(await processAgency(config));
}

// Create indicies
indicies(client).then(() => client.quit());

// Respect short-circuit command line option
if (args.includes('--skip-geojson')) {
    console.log("Skipping GeoJSON export and upload.");
    process.exit();
}

// Merge the datasets from each agency into one
let { stops, routes } = datasets.reduce((result, current) => {
    Object.keys(current ?? {}).forEach(key => {
        if (!result[key]) { result[key] = []; }
        result[key] = result[key].concat(current[key]);
    });
    return result;
}, {});
datasets = undefined;

// Convert to GeoJSON and optionally upload to Mapbox
const local = args.includes('--export-local');
const stopsPromise = geojson('stops', stops, local);
const routesPromise = geojson('routes', routes, local);

if (!local) {
    stopsPromise.then(json => mapbox('transit-a11y-stops', json))
    routesPromise.then(json => mapbox('transit-a11y-routes', json))
} else {
    await Promise.all([ stopsPromise, routesPromise ]);
    console.log("Exported GeoJSON to the project root directory.");
}