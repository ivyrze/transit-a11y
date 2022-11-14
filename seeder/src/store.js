import { SchemaFieldTypes } from 'redis';

const schema = {
    agencies: {
        id: { from: 'agency_id' },
        name: { from: 'agency_name' },
        url: { from: 'agency_url' },
        bounds: { from: 'agency_bounds', apply: bounds => bounds.join(',') },
        vehicle: { from: 'agency_vehicle' },
        reviews: { from: 'agency_reviews' }
    },
    stops: {
        id: { from: 'stop_id' },
        name: { from: 'stop_name' },
        description: { from: 'accessibility_desc', optional: true },
        accessibility: { from: 'wheelchair_boarding' },
        coordinates: { generate: stop => stop.stop_lon + ',' + stop.stop_lat },
        url: { from: 'stop_url', optional: true },
        tags: { from: 'stop_tags', optional: true },
        routes: { from: 'routes', apply: routes => routes.map(route => route.route_id) },
    },
    routes: {
        id: { from: 'route_id' },
        name: { generate: route =>
            (route.route_long_name ?? route.route_short_name)
        },
        number: { generate: route =>
            (route.route_short_name ?? route.route_long_name).match(/\w(?!.*\d)|\d+/)[0]
        },
        color: { from: 'route_color' }
    }
};

export const store = async (client, agency, stops, routes) => {
    console.log("Storing " + stops.length + " stops into the database...");
    
    const transaction = client.multi();
    
    // Iterate through each model type
    const dataset = { agencies: [ agency ], stops, routes };
    for (const type in schema) {
        for (const data of dataset[type]) {
            // Iterate through each schema attribute for every object
            for (let [ key, options ] of Object.entries(schema[type])) {
                let value;
                if (options.from) {
                    value = data[options.from];
                } else if (options.generate) {
                    value = options.generate(data);
                }
                if (options.apply) {
                    value = options.apply(value);
                }
                
                if (value == undefined && !options.optional) {
                    throw 'Required field was missing from the dataset';
                }
                
                if (typeof value === 'boolean') {
                    value = value.toString();
                }
                
                if (key == "id") {
                    transaction.sAdd(type, value);
                    continue;
                }
                
                const id = data[schema[type]['id'].from];
                if (Array.isArray(value)) {
                    for (const subvalue of value) {
                        transaction.sAdd(type + ':' + id + ':' + key, subvalue);
                    }
                } else if (value != undefined) {
                    transaction.hSet(type + ':' + id, key, value);
                }
            }
        }
    }
    
    await transaction.exec();
    console.log("Storing stop data completed successfully.");
};

export const defaults = (client, config) => {
    return client.hSet('config', 'default', config.default);
};

export const indicies = async client => {
    const existing = await client.ft._list();
    
    if (!existing.includes('idx:stops')) {
        await client.ft.create('idx:stops',
            {
                name: { type: SchemaFieldTypes.TEXT },
                coordinates: { type: SchemaFieldTypes.GEO }
            },
            {
                ON: 'HASH',
                PREFIX: 'stops:'
            }
        );
    }
    
    if (!existing.includes('idx:users')) {
        await client.ft.create('idx:users',
            {
                username: { type: SchemaFieldTypes.TAG, NOSTEM: true },
                email: { type: SchemaFieldTypes.TAG, NOSTEM: true }
            },
            {
                ON: 'HASH',
                PREFIX: 'users:',
                NOHL: true,
                NOFREQS: true
            }
        );
    }
};