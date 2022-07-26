import * as turf from '@turf/turf';
import * as fs from 'fs';
import temp from 'temp';

const geojson = (mode, dataset, local) => {
    return new Promise((resolve, error) => {
        if (!local) {
            temp.track();
            var stream = temp.createWriteStream({ suffix: '.geojsonld' });
        } else {
            var stream = fs.createWriteStream(mode + '.geojsonld');
        }
        
        dataset.forEach(data => {
            if (mode == 'routes') {
                var geometry = data.route_shapes.map(shape => {
                    return shape.map(point => {
                        return [
                            parseFloat(point.shape_pt_lon),
                            parseFloat(point.shape_pt_lat)
                        ];
                    });
                });
                var properties = [
                    'route_color'
                ];
            } else if (mode == 'stops') {
                var geometry = [
                    parseFloat(data.stop_lon),
                    parseFloat(data.stop_lat)
                ];
                var properties = [
                    'stop_id',
                    'stop_name',
                    'wheelchair_boarding'
                ];
            } else {
                console.error("Unknown GeoJSON conversion mode.");
                return undefined;
            }
            
            // Supplement the property keys with the actual value
            properties = Object.fromEntries(properties.map(property => {
                return [ property, data[property] ];
            }));
            
            // Build GeoJSON feature
            let feature;
            if (mode == 'routes') {
                feature = (geometry.length == 1) ?
                    turf.lineString(geometry[0], properties) :
                    turf.multiLineString(geometry, properties);
                
                feature = turf.simplify(feature,
                    { tolerance: 1 / 10 ** 5, highQuality: true });
            } else {
                feature = turf.point(geometry, properties)
            }
            
            // Use line-delimited GeoJSON format
            stream.write(JSON.stringify(feature) + "\n");
        });
        
        stream.end();
        stream.on("finish", () => {
            console.log("Converted " + mode + " to GeoJSON successfully.");
            resolve(stream.path);
        });
    });
}

export { geojson };