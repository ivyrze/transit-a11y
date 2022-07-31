import { SchemaFieldTypes } from 'redis';

const store = async (client, stops, routes) => {
    return new Promise(resolve => {
        console.log("Storing " + stops.length + " stops into the database...");
        
        stops.forEach(stop => {
            client.sAdd('stops', stop.stop_id);
            client.hSet('stops:' + stop.stop_id, 'name', stop.stop_name);
            client.hSet('stops:' + stop.stop_id, 'accessibility', stop.wheelchair_boarding);
            client.hSet('stops:' + stop.stop_id, 'coordinates', stop.stop_lon + ',' + stop.stop_lat);
            
            stop.routes.forEach(route => {
                client.sAdd('stops:' + stop.stop_id + ':routes', route.route_id);
            });
        });
        
        routes.forEach(route => {
            client.sAdd('routes', route.route_id);
            client.hSet('routes:' + route.route_id, 'name', route.route_long_name ?? route.route_short_name);
            client.hSet('routes:' + route.route_id, 'color', route.route_color);
        });
        
        resolve();
    }).then(() => {
        console.log("Storing stop data completed successfully.");
    });
};

const indicies = async client => {
    const existing = await client.ft._list();
    
    if (!existing.includes('idx:stops')) {
        return client.ft.create('idx:stops',
            {
                name: { type: SchemaFieldTypes.TEXT },
                coordinates: { type: SchemaFieldTypes.GEO }
            },
            {
                ON: 'HASH',
                PREFIX: 'stops:'
            }
        );
    } else {
        console.log("Skipping index creation – already exists.");
        return Promise.resolve();
    }
};

export { store, indicies };