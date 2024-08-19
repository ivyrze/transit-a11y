import { createClient } from '@sanity/client';
import { sanityOptions } from '../../common/utils.js';

export const extend = async (agency, stops, routes, id) => {
    const client = createClient(sanityOptions());
    
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
                "route_color": color.hex,
                "route_shapes": shapes[].geojson
            }
        }`
    );
    
    appendicies.forEach(appendix => {
        appendix.route_shapes = appendix.route_shapes?.map(shape => {
            return JSON.parse(shape);
        });
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
    const skipped = stops.filter(stop => stop.stop_removed).map(stop => stop.stop_id);
    stops = stops.filter(stop => !stop.stop_removed);
    
    routes = routes.map(route => {
        route.route_directions = route.route_directions.map(direction => {
            direction.segments = direction.segments.map(segment => {
                segment.branches = segment.branches.map(branch => {
                    branch.stops = branch.stops.filter(stop => {
                        return !skipped.includes(stop);
                    });
                    return branch;
                });
                return segment;
            });
            return direction;
        });
        return route;
    });
    
    return { agency, stops, routes };
};