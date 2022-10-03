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
                "stop_tags": tags,
                "stop_url": url,
                "wheelchair_boarding": accessibility,
                "accessibility_desc": description
            },
            _type == "route" => {
                "route_id": id,
                "route_long_name": name
            }
        }`
    );
    
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
                if (appendix[key]?.length) {
                    data[key] = appendix[key];
                }
            });
        });
    });
    
    return { agency, stops, routes };
};