export const override = (source, options, target) => {
    source[target] = options.target;
    return source;
};