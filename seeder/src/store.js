import { prisma } from '../../common/prisma/index.js';

const schema = {
    agencies: {
        id: { from: 'agency_id' },
        name: { from: 'agency_name' },
        url: { from: 'agency_url' },
        bounds: { from: 'agency_bounds' },
        vehicle: { from: 'agency_vehicle' },
        default: { from: 'agency_default' }
    },
    stops: {
        id: { from: 'stop_id' },
        name: { from: 'stop_name' },
        description: { from: 'accessibility_desc', optional: true },
        accessibility: { from: 'wheelchair_boarding', apply: accessibility =>
            ([ 'unknown', 'accessible', 'inaccessible' ][accessibility ?? 0])
        },
        coordinates: { generate: stop => [ stop.stop_lon, stop.stop_lat ] },
        url: { from: 'stop_url', optional: true },
        tags: { from: 'stop_tags', optional: true },
        major: { from: 'is_major', optional: true }
    },
    routes: {
        id: { from: 'route_id' },
        name: { generate: route =>
            (route.route_long_name ?? route.route_short_name)
        },
        number: { generate: route =>
            (route.route_short_name ?? route.route_long_name).match(/\w(?!.*\d)|\d+/)[0]
        },
        color: { from: 'route_color' },
        directions: { from: 'route_directions', apply: directions => {
            return { create: directions.map(direction => {
                direction.segments = { create: direction.segments.map(segment => {
                    segment.branches = { create: segment.branches.map(branch => {
                        branch.stops = { connect: branch.stops.map(stop => {
                            return { id: stop };
                        }) };
                        return branch;
                    }) };
                    return segment;
                }) };
                return direction;
            }) };
        } }
    }
};

export const store = async (agencies, stops, routes, transaction) => {
    console.log("Storing " + stops.length + " stops into the database...");
    
    // Iterate through each model type
    const dataset = { agencies, stops, routes };
    for (const type in schema) {
        const model = (type == 'agencies') ? 'agency' :
            (type == 'stops') ? 'stop' :
            (type == 'routes') ? 'route' : false;
        
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
            
            transaction.push(prisma[model].upsert({
                where: { id: object.id },
                update: object,
                create: object
            }));
        }
    }
    
    await prisma.$transaction(transaction);
    
    await reconsensus();
    
    console.log("Storing stop data completed successfully.");
};

const reconsensus = async () => {
    // Rebuild review-based accessibility state data
    const reviewed = await prisma.review.findMany({
        select: {
            stopId: true
        },
        where: {
            NOT: {
                accessibility: { equals: [ "unknown" ] }
            }
        }
    });
    
    await Promise.all(reviewed.map(review => {
        return prisma.stop.consensus(review.stopId);
    }));
};