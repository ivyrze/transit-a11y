export const idPrefixer = (source, id) => {
    const target = (source.stop_id) ? 'stop_id' : 'route_id';
    source[target] = id + "-" + source[target];
    
    if (source.route_directions) {
        source.route_directions = source.route_directions.map(direction => {
            direction.segments = direction.segments.map(segment => {
                return segment.map(branch => {
                    return branch.map(stop => id + "-" + stop);
                });
            });
            return direction;
        });
    }
    
    return source;
};