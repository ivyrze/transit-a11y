import sanity from '@sanity/client';
import { sanityOptions } from '../../utils.js';

const extend = async (stops, id) => {
    const client = sanity(sanityOptions);
    
    const appendicies = await client.fetch('*[_type=="stop" && agency->id=="' + id + '"]{id, tags, url}');
    
    stops.forEach(stop => {
        let appendix = appendicies.find(appendix => stop.stop_id == appendix.id);
        if (!appendix) { return; }
        
        delete appendix.id;
        Object.keys(appendix).forEach(key => {
            if (appendix[key]?.length) {
                stop['stop_' + key] = appendix[key];
            }
        });
    });
    
    return stops;
};

export { extend };