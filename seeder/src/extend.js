import sanity from '@sanity/client';
import { sanityOptions } from '../../utils.js';

export const extend = async (stops, routes, id) => {
    const client = sanity(sanityOptions);
    
    const appendicies = await client.fetch(
        '*[_type in [ "stop", "route" ] && agency->id=="' + id + '"]{\
            _type == "stop" => { _type, id, tags, url },\
            _type == "route" => { _type, id, "long_name": name }\
        }'
    );
    
    const dataset = { stop: stops, route: routes };
    Object.keys(dataset).forEach(type => {
        dataset[type].forEach(data => {
            let appendix = appendicies.find(appendix => {
                return appendix._type == type && appendix.id == data[type + '_id'];
            });
            if (!appendix) { return; }
            
            delete appendix.id;
            Object.keys(appendix).forEach(key => {
                if (appendix[key]?.length) {
                    data[type + '_' + key] = appendix[key];
                }
            });
        });
    });
    
    return { stops, routes };
};