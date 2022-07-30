import temp from 'temp';
import combine from '@turf/combine';
import * as gtfsUtils from 'gtfs/lib/geojson-utils.js';
import * as turfUtils from '@turf/helpers';
import * as fs from 'fs';

const routeProperties = [
    'route_color'
];
const stopProperties = [
    'stop_id',
    'stop_name',
    'wheelchair_boarding'
];

const geojson = (mode, dataset, local) => {
    return new Promise((resolve, error) => {
        if (!local) {
            temp.track();
            var stream = temp.createWriteStream({ suffix: '.geojsonld' });
        } else {
            var stream = fs.createWriteStream(mode + '.geojsonld');
        }
        
        const features = (mode == 'routes') ?
            routesGeoJSON(dataset) : stopsGeoJSON(dataset);
        
        // Use line-delimited GeoJSON format
        features.forEach(feature => {
            stream.write(JSON.stringify(feature) + "\n");
        });
        
        stream.end();
        stream.on("finish", () => {
            console.log("Converted " + mode + " to GeoJSON successfully.");
            resolve(stream.path);
        });
    });
};

const routesGeoJSON = routes => {
    return routes.map(route => {
        // Simplify route shape representation and isolate geometry
        let features = gtfsUtils.shapesToGeoJSONFeatures(route.route_shapes);
        
        // Merge to multi line string format and remove collection wrapper
        if (features.length > 1) {
            features = combine(turfUtils.featureCollection(features)).features;
        }
        features = features[0];
        
        // Gather properties to be reattached
        features.properties = Object.fromEntries(routeProperties.map(property => {
            return [ property, route[property] ];
        }));
        
        return features;
    });
};

const stopsGeoJSON = stops => {
    let features = gtfsUtils.stopsToGeoJSON(stops).features;
    
    // Remove unnecessary properties
    features.forEach(feature => {
        Object.keys(feature.properties).forEach(property => {
            if (!stopProperties.includes(property)) {
                delete feature.properties[property];
            }
        })
    });
    
    return features;
};

export { geojson };