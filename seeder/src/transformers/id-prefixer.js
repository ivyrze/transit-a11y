const idPrefixer = (source, id) => {
    if (source.stop_id) {
        source.stop_id = id + "-" + source.stop_id;
        source.routes = source.routes.map(route => idPrefixer(route, id));
    } else if (source.route_id) {
        source.route_id = id + "-" + source.route_id;
    }
    
    return source;
};

export { idPrefixer };