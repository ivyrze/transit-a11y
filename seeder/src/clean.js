import { matchKeyPattern, cleanKeyPattern } from '../../utils.js';

export const clean = async client => {
    console.log("Cleaning existing GTFS data...");
    
    await Promise.all([
        client.del("agencies"),
        client.del("stops"),
        client.del("routes"),
        cleanKeyPattern(client, "agencies:*"),
        cleanKeyPattern(client, "stops:*", [ ":reviews" ]),
        cleanKeyPattern(client, "routes:*"),
        cleanKeyPattern(client, "geometry:*")
    ]);
    
    console.log("Cleaning completed successfully.");
};

export const orphans = async (client, stops) => {
    let reviewed = await matchKeyPattern(client, "stops:*:reviews");
    reviewed = reviewed.map(key => {
        return key.replace('stops:', '').replace(':reviews', '');
    });
    
    return reviewed.filter(key => {
        return !stops.some(stop => key == stop.stop_id);
    });
};