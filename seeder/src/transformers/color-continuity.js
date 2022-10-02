export const colorContinuity = (source) => {
    const colors = [
        'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown'
    ];
    
    const name = source.route_long_name ?? source.route_short_name;
    const replaced = colors.some(color => {
        const colorUpper = color.charAt(0).toUpperCase() + color.slice(1);
        
        if (name.includes(colorUpper)) {
            source.route_color = color;
            return true;
        }
        
        return false;
    });
    
    if (!replaced) {
        console.warn("Continuity warning: Route '" + name + "' has partially supported color.");
        
        source.route_color = source.route_color.toLowerCase();
        if (!source.route_color.startsWith("#")) {
            source.route_color = "#" + source.route_color;
        }
    }
    
    return source;
};