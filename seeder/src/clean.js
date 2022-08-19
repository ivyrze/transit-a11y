import { cleanKeyPattern } from '../../utils.js';

const clean = client => {
    console.log("Cleaning existing GTFS data...");
    
    return Promise.all([
        client.del("agencies"),
        client.del("stops"),
        client.del("routes"),
        cleanKeyPattern(client, "agencies:*"),
        cleanKeyPattern(client, "stops:*"),
        cleanKeyPattern(client, "routes:*")
    ]).then(() => {
        console.log("Cleaning completed successfully.");
    });
};

export { clean };