import { SchemaFieldTypes } from 'redis';

const store = async (client, agency, stops, routes) => {
    console.log("Storing " + stops.length + " stops into the database...");
    
    const transaction = client.multi();
    
    transaction.sAdd('agencies', agency.agency_id);
    transaction.hSet('agencies:' + agency.agency_id, 'name', agency.agency_name);
    transaction.hSet('agencies:' + agency.agency_id, 'url', agency.agency_url);
    transaction.hSet('agencies:' + agency.agency_id, 'center', agency.agency_center.join(','));
    
    stops.forEach(stop => {
        transaction.sAdd('stops', stop.stop_id);
        transaction.hSet('stops:' + stop.stop_id, 'name', stop.stop_name);
        transaction.hSet('stops:' + stop.stop_id, 'accessibility', stop.wheelchair_boarding);
        transaction.hSet('stops:' + stop.stop_id, 'coordinates', stop.stop_lon + ',' + stop.stop_lat);
        
        if (stop.stop_url) {
            transaction.hSet('stops:' + stop.stop_id, 'url', stop.stop_url);
        }
        
        if (stop.stop_tags) {
            stop.stop_tags.forEach(tag => {
                transaction.sAdd('stops:' + stop.stop_id + ':tags', tag);
            });
        }
        
        stop.routes.forEach(route => {
            transaction.sAdd('stops:' + stop.stop_id + ':routes', route.route_id);
        });
    });
    
    routes.forEach(route => {
        transaction.sAdd('routes', route.route_id);
        transaction.hSet('routes:' + route.route_id, 'name', route.route_long_name ?? route.route_short_name);
        transaction.hSet('routes:' + route.route_id, 'color', route.route_color);
    });
    
    await transaction.exec();
    console.log("Storing stop data completed successfully.");
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