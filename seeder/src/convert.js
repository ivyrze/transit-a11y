import combine from '@turf/combine';
import * as gtfsUtils from 'gtfs/lib/geojson-utils.js';
import * as turfUtils from '@turf/helpers';

const schema = {
    routes: [
        'route_color'
    ],
    stops: [
        'stop_id',
        'stop_name',
        'wheelchair_boarding',
        'is_major'
    ]
};

export const geojson = async (client, stops, routes) => {
    stops = stopsGeoJSON(stops);
    routes = routesGeoJSON(routes);
    
    await client.set('geometry:stops', JSON.stringify(stops));
    await client.set('geometry:routes', JSON.stringify(routes));
    
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