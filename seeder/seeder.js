import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

import { clean, orphans } from './src/clean.js';
import { load } from './src/load.js';
import { extend } from './src/extend.js';
import { store, defaults, indicies } from './src/store.js';
import { geojson, link } from './src/convert.js';

import * as transformers from './src/transformers/index.js';

// Read config file
dotenv.config();
const configs = JSON.parse(await readFile('seeder/config.json'));

// Create database connection
const client = createClient(redisOptions);
client.on('error', error => console.error(error));

await client.connect();

// Import and process GTFS data
const processAgency = async config => {
    let { agency, stops, routes } = await load(config);
    
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
    
    // Remove disallowed characters
    stops = stops.map(stop => transformers.idSanitizer(stop));
    routes = routes.map(route => transformers.idSanitizer(route));
    
    // Supplement with Sanity CMS data
    ({ agency, stops, routes } = await extend(agency, stops, routes, config.id));
    
    // General transformations
    stops = stops.map(stop => transformers.idPrefixer(stop, config.id));
    routes = routes.map(route => transformers.idPrefixer(route, config.id));
    routes = routes.map(route => transformers.colorContinuity(route));
    
    // Set base data for review-enabled agencies
    if (config.reviews) {
        stops = stops.map(stop => (stop.wheelchair_boarding = 0, stop));
        stops = stops.map(stop => (stop.stop_tags = [], stop));
    }
        
    // Merge agency constants into object for storage
    agency.agency_vehicle = config.vehicle;
    agency.agency_reviews = config.reviews;
    
    return { agency, stops, routes };
};

let datasets = [];
for await (let config of configs.agencies) {
    datasets.push(await processAgency(config));
}

// Combine nearby stops from different agencies
datasets = await link(datasets);

// Merge the datasets from each agency into one
let { agency: agencies, stops, routes } = datasets.reduce((result, current) => {
    Object.keys(current ?? {}).forEach(key => {
        if (!result[key]) { result[key] = []; }
        Array.isArray(current[key]) ?
            result[key].push(...current[key]) :
            result[key].push(current[key]);
    });
    return result;
}, {});
datasets = undefined;

// Check for broken references before storing data
const orphaned = await orphans(client, stops);
if (orphaned.length) {
    orphaned.forEach(orphan => {
        console.error("Import error: Stop '" + orphan + "' is reviewed but wasn't imported.");
    });
    
    console.error("Exiting without change due to fatal error.");
    
    await client.quit();
    process.exit();
}

// Remove existing database data
await clean(client);

// Create indicies
await Promise.all([ defaults(client, configs), indicies(client) ]);

// Store everything in Redis database
await store(client, agencies, stops, routes);

// Convert to GeoJSON and optionally upload to Mapbox
await geojson(client, stops, routes);
await client.publish('geometry:updates', '*');

await client.quit();