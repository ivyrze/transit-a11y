export const idPrefixer = (source, id) => {
    const target = (source.stop_id) ? 'stop_id' : 'route_id';
    source[target] = id + "-" + source[target];
    
    if (source.routes) {
        source.routes = source.routes.map(route => idPrefixer(route, id));
    }
    
    return source;
};