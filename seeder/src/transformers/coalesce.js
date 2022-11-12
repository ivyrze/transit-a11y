export const coalesce = (source, options, target) => {
    if (source[target] == undefined || source[target] == 0) {
        source[target] = options.target;
    }
    
    return source;
};