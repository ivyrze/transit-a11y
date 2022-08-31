import sanity from '@sanity/client';

const extend = async (stops, id) => {
    const client = sanity({
        projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
        dataset: process.env.NODE_ENV ?? 'development',
        apiVersion: "2021-10-21",
        useCdn: false
    });
    
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