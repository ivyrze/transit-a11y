import { cleanKeyPattern } from '../../utils.js';

export const clean = async client => {
    console.log("Cleaning existing GTFS data...");
    
    await Promise.all([
        client.del("agencies"),
        client.del("stops"),
        client.del("routes"),
        cleanKeyPattern(client, "agencies:*"),
        cleanKeyPattern(client, "stops:*"),
        cleanKeyPattern(client, "routes:*"),
        cleanKeyPattern(client, "geometry:*")
    ]);
    
    console.log("Cleaning completed successfully.");
};