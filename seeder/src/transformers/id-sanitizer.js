export const idSanitizer = source => {
    const target = (source.stop_id) ? 'stop_id' : 'route_id';
    source[target] = source[target].replace(/[^\w\d]/g, '');
    return source;
};