import temp from 'temp';

const geojson = (mode, dataset) => {
    return new Promise((resolve, error) => {
        temp.track();
        const stream = temp.createWriteStream({ suffix: '.geojson' });
        
        dataset.forEach(data => {
            if (mode == 'routes') {
                var type = "LineString";
                var coordinates = data.route_shape.map(shape => {
                    return [
                        parseFloat(shape.shape_pt_lon),
                        parseFloat(shape.shape_pt_lat)
                    ];
                });
                var properties = [
                    'route_color'
                ];
            } else if (mode == 'stops') {
                var type = "Point";
                var coordinates = [
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
            
            properties = Object.fromEntries(properties.map(property => {
                return [ property, data[property] ];
            }));
            
            let json = {
                type: "Feature",
                geometry: {
                    type: type,
                    coordinates: coordinates
                },
                properties: properties
            };
            
            // Use line-delimited GeoJSON format
            stream.write(JSON.stringify(json) + "\n");
        });
        
        stream.end();
        stream.on("finish", (e) => {
            console.log("Converted " + mode + " to GeoJSON conversion.");
            resolve(stream.path);
        });
    });
}

export { geojson };