import mongoose from 'mongoose';
import { Agency } from '../../models/agency.js';
import { Stop } from '../../models/stop.js';
import { Route } from '../../models/route.js';
import { Review } from '../../models/review.js';

const schema = {
    agencies: {
        _id: { from: 'agency_id' },
        name: { from: 'agency_name' },
        url: { from: 'agency_url' },
        bounds: { from: 'agency_bounds' },
        vehicle: { from: 'agency_vehicle' },
        reviews: { from: 'agency_reviews' },
        default: { from: 'agency_default' }
    },
    stops: {
        _id: { from: 'stop_id' },
        name: { from: 'stop_name' },
        description: { from: 'accessibility_desc', optional: true },
        accessibility: { from: 'wheelchair_boarding', apply: accessibility =>
            ([ 'unknown', 'accessible', 'inaccessible' ][accessibility ?? 0])
        },
        coordinates: { generate: stop => [ stop.stop_lon, stop.stop_lat ] },
        url: { from: 'stop_url', optional: true },
        tags: { from: 'stop_tags', optional: true },
        routes: { from: 'routes', apply: routes => routes.map(route => route.route_id) },
        major: { from: 'is_major', optional: true }
    },
    routes: {
        _id: { from: 'route_id' },
        name: { generate: route =>
            (route.route_long_name ?? route.route_short_name)
        },
        number: { generate: route =>
            (route.route_short_name ?? route.route_long_name).match(/\w(?!.*\d)|\d+/)[0]
        },
        color: { from: 'route_color' }
    }
};

export const store = async (agencies, stops, routes) => {
    console.log("Storing " + stops.length + " stops into the database...");
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    // Iterate through each model type
    const dataset = { agencies, stops, routes };
    for (const type in schema) {
        let objects = [];
        let Model = (type == 'agencies') ? Agency :
            (type == 'stops') ? Stop :
            (type == 'routes') ? Route : false;
        
        for (const data of dataset[type]) {
            // Iterate through each schema attribute for every object
            let object = {};
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
                
                object[key] = value;
            }
            
            objects.push(new Model(object));
        }
        
        await Model.insertMany(objects, { session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    await reconsensus();
    
    console.log("Storing stop data completed successfully.");
};

const reconsensus = async () => {
    // Rebuild review-based accessibility state data
    let reviewed = await Review.find({}).distinct('stop');
    await Promise.all(reviewed.map(async key => {
        const stop = await Stop.findById(key);
        await stop.consensus();
    }));
};