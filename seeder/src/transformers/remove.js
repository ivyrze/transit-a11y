export const remove = (source, options, target) => {
    source[target] = source[target].replace(options.target, '').trim();
    return source;
};