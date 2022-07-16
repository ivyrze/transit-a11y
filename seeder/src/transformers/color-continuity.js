const colorContinuity = (source) => {
    const colors = [
        'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown'
    ];
    
    const replaced = colors.some(color => {
        const colorUpper = color.charAt(0).toUpperCase() + color.slice(1);
        
        if (source.route_long_name.startsWith(colorUpper) ||
            source.route_short_name.startsWith(colorUpper)) {
            source.route_color = color;
            return true;
        }
        
        return false;
    });
    
    if (!replaced) {
        console.warn("Continuity warning: Route '" + source.route_long_name + "' has unsupported color.");
    }
    
    return source;
}
export { colorContinuity };