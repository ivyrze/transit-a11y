import sanity from '@sanity/client';
import { sanityOptions } from '../../utils.js';

export const extend = async (agency, stops, routes, id) => {
    const client = sanity(sanityOptions);
    
    const appendicies = await client.fetch(
        `*[(_type == "agency" && id == "` + id + `")
        || (_type in [ "stop", "route" ] && agency->id=="` + id + `")]{
            _type,
            _type == "agency" => {
                "agency_id": id,
                "agency_name": name
            },
            _type == "stop" => {
                "stop_id": id,
                "stop_name": name,
                "stop_tags": tags,
                "stop_url": url,
                "wheelchair_boarding": accessibility,
                "accessibility_desc": description,
                unlinked != true => {
                    "linked_with": linked[]->{
                        "linked_id": agency->id + "-" + id
                    }.linked_id
                },
                unlinked == true => {
                    "linked_with": []
                },
                "stop_removed": removed
            },
            _type == "route" => {
                "route_id": id,
                "route_long_name": name,
                "route_shapes": shapes
            }
        }`
    );
    
    // Convert shape GeoJSON temporarily into shape object format
    appendicies.forEach(appendix => {
        if (appendix.route_shapes == null) { return; }
        
        let shapes = [];
        appendix.route_shapes.forEach((shape, index) => {
            JSON.parse(shape).geometry.coordinates.forEach(coords => {
                shapes.push({
                    shape_id: index,
                    shape_pt_lon: coords[0],
                    shape_pt_lat: coords[1]
                });
            });
        });
        
        appendix.route_shapes = shapes;
    });
    
    // Merge appendices into dataset objects
    const dataset = { agency: [ agency ], stop: stops, route: routes };
    Object.keys(dataset).forEach(type => {
        dataset[type].forEach(data => {
            let appendix = appendicies.find(appendix => {
                return appendix[type + '_id'] == data[type + '_id']
                    && appendix._type == type;
            });
            if (!appendix) { return; }
            
            delete appendix._type;
            delete appendix[type + "_id"];
            
            Object.keys(appendix).forEach(key => {
                if (appendix[key] != null) {
                    data[key] = appendix[key];
                }
            });
        });
    });
    
    // Output a warning if there are remaining appendices
    appendicies.filter(appendix => appendix._type).forEach(appendix => {
        const type = appendix._type.charAt(0).toUpperCase()
            + appendix._type.substr(1).toLowerCase();
        const id = appendix[appendix._type + "_id"];
        console.warn("Import warning: " + type + " appendix for '" + id + "' not matched.");
    });
    
    // Handle skip import flag
    stops = stops.filter(stop => !stop.stop_removed);
    
    return { agency, stops, routes };
};