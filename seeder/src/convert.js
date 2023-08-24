import combine from '@turf/combine';
import * as gtfsUtils from 'gtfs/lib/geojson-utils.js';
import * as turfUtils from '@turf/helpers';
import turfDistance from '@turf/distance';
import { Geometry } from '../../common/models/geometry.js';

const schema = {
    routes: [
        'route_id',
        'route_short_name',
        'route_long_name',
        'route_color'
    ],
    stops: [
        'stop_id',
        'stop_name',
        'wheelchair_boarding',
        'is_major'
    ]
};

export const geojson = async (stops, routes) => {
    stops = new Geometry({ _id: 'stops', geojson: stopsGeoJSON(stops) });
    routes = new Geometry({ _id: 'routes', geojson: routesGeoJSON(routes) });
    
    await stops.save();
    await routes.save();
    
    console.log("Converted geometry to GeoJSON successfully.");
};

const routesGeoJSON = routes => {
    return turfUtils.featureCollection(routes.map(route => {
        // Simplify route shape representation and isolate geometry
        let features = gtfsUtils.shapesToGeoJSONFeatures(route.route_shapes);
        
        // Merge to multi line string format and remove collection wrapper
        if (features.length > 1) {
            features = combine(turfUtils.featureCollection(features)).features;
        }
        features = features[0];
        
        // Gather properties to be reattached
        features.properties = Object.fromEntries(schema.routes.map(property => {
            return [ property, route[property] ];
        }));
        
        return features;
    }));
};

const stopsGeoJSON = stops => {
    let collection = gtfsUtils.stopsToGeoJSON(stops);
    
    // Remove unnecessary properties
    collection.features.forEach(feature => {
        Object.keys(feature.properties).forEach(property => {
            if (!schema.stops.includes(property)) {
                delete feature.properties[property];
            }
        })
    });
    
    return collection;
};

export const link = datasets => {
    let links = {};
    for (let i = 0; i < datasets.length - 1; i++) {
        for (let j = i + 1; j < datasets.length; j++) {
            // Only link agencies with the same vehicle type
            if (datasets[i].agency.agency_vehicle != datasets[j].agency.agency_vehicle) {
                continue;
            }
            
            const newLinks = findNearest(datasets[i].stops, datasets[j].stops);
            
            // Combine with existing links
            for (const parent in newLinks) {
                links[parent] = links[parent] ?
                    links[parent].concat(newLinks[parent]) :
                    [ newLinks[parent] ];
            }
        }
    }
    
    // Temporarily use key-value organization
    let stops = {}, routes = {};
    datasets.forEach(dataset => {
        dataset.stops.forEach(stop => stops[stop.stop_id] = stop);
        dataset.routes.forEach(route => routes[route.route_id] = route);
    });
    
    // Merge into stop objects alongside appendix data
    for (const link in links) {
        if (stops[link].linked_with === undefined) {
            stops[link].linked_with = links[link];
        }
    }
    
    // Collapse children stops into parents recursively
    for (const stop in stops) {
        if (stops[stop].linked_with) {
            [ stops, routes ] = collapseStops(stops, routes, stop);
        }
    }
    
    // Revert back to original grouping
    datasets = datasets.map(dataset => {
        const prefix = dataset.routes[0].route_id.split('-')[0];
        dataset.stops = Object.values(stops).filter(stop => {
            return stop.stop_id.startsWith(prefix + '-');
        });
        dataset.routes = Object.values(routes).filter(route => {
            return route.route_id.startsWith(prefix + '-');
        });
        
        return dataset;
    });
    
    return datasets;
};

const collapseStops = (stops, routes, parent) => {
    stops[parent].linked_with.forEach(child => {
        if (!stops[child]) {
            console.warn("Import warning: Weak linked stop reference in '" + parent + "' to child '" + child + "'.");
            return;
        }
        
        if (stops[child].linked_with?.length) {
            [ stops, routes ] = collapseStops(stops, routes, child);
        }
        
        routes = updateStopReference(routes, child, parent);
        
        // Remove child stops to prevent storage
        delete stops[child];
    });
    
    // Prevent recursion over a child more than once
    delete stops[parent].linked_with;
    
    return [ stops, routes ];
};

const updateStopReference = (routes, from, to) => {
    for (let route in routes) {
        routes[route].route_directions = routes[route].route_directions.map(direction => {
            direction.segments = direction.segments.map(segment => {
                return segment.map(branch => branch.map(stop => {
                    if (stop == from) {
                        return to;
                    }
                    
                    return stop;
                }));
            });
            return direction;
        });
    }
    
    return routes;
};

const findNearest = (setA, setB) => {
    let links = {};
    for (const a of setA) {
        const nearest = setB.reduce((result, current) => {
            // Don't link stops that are far away
            const distance = stopDistance(a, current);
            if (distance >= 30) { return result; }
            
            // Don't link stops that have already been linked
            // during this comparison set
            if (Object.values(links).includes(current.stop_id)) {
                return result;
            }
            
            // Without a comparator, distance can't be computed
            if (!result) { return current; }
            
            return (stopDistance(a, result) < distance) ? result : current;
        }, false);
        
        if (nearest) {
            links[a.stop_id] = nearest.stop_id;
        }
    }
    
    return links;
};

const stopDistance = (a, b) => {
    return turfDistance(
        [ a.stop_lon, a.stop_lat ],
        [ b.stop_lon, b.stop_lat ],
        { units: 'kilometers' }
    ) * 1000;
};