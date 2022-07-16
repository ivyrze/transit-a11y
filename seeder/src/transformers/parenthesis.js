const parenthesis = (source, options, target) => {
    source[target] = source[target].replace(/\s*\(([^)]+)\)/, '');
    return source;
}
export { parenthesis };