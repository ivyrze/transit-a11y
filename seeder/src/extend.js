import sanity from '@sanity/client';

const extend = async (stops, id) => {
    const client = sanity({
        projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
        dataset: process.env.NODE_ENV ?? 'development',
        apiVersion: "2021-10-21",
        useCdn: false
    });
    
    const appendicies = await client.fetch('*[_type=="stop" && agency->id=="' + id + '"]{id, url}');
    
    stops.forEach(stop => {
        const appendix = appendicies.find(appendix => stop.stop_id == appendix.id);
        if (appendix && appendix.url) {
            stop.stop_url = appendix.url;
        }
    });
    
    return stops;
};

export { extend };