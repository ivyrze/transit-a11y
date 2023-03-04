export const transform = (object, options) => {
    if (transformations[options.type]) {
        const source = options.source.split('.')[1];
        
        if (source == 'stop_id' && object.route_directions) {
            object.route_directions = object.route_directions.map(direction => {
                direction.segments = direction.segments.map(segment => {
                    return segment.map(branch => branch.map(stop => {
                        return transformations[options.type](stop, options);
                    }));
                });
                return direction;
            });
        } else {
            object[source] = transformations[options.type](object[source], options);
        }
        
        return object;
    } else if (transformationsMulti[options.type]) {
        return transformationsMulti[options.type](object, options);
    }
};

export const transformSanitize = object => {
    object = transform(object, {
        source: object.stop_id ? 'stops.stop_id' : 'routes.route_id',
        type: 'idSanitizer'
    });
    
    if (object.route_directions) {
        object = transform(object, {
            source: 'routes.stop_id',
            type: 'idSanitizer'
        });
    }
    
    return object;
};

export const transformDefault = (object, options) => {
    object = transform(object, {
        source: object.stop_id ? 'stops.stop_id' : 'routes.route_id',
        type: 'idPrefixer',
        ...options
    });
    
    if (object.route_directions) {
        object = transform(object, {
            source: 'routes.stop_id',
            type: 'idPrefixer',
            ...options
        });
    }
    
    if (object.route_color) {
        object = transform(object, {
            source: object,
            type: 'colorContinuity'
        });
    }
    
    return object;
};

const transformations = {
    coalesce: (from, options) => {
        return (from == undefined || from == 0) ? options.target : from;
    },
    idPrefixer: (from, options) => {
        return options.id + "-" + from;
    },
    idSanitizer: from => {
        return from.replace(/[^\w\d]/g, '');
    },
    override: (from, options) => {
        return options.target;
    },
    parenthesis: from => {
        return from.replace(/\s*\(([^)]+)\)/, '');
    },
    prettify: from => {
        // Remove duplicate spaces
        from = from.replace(/\s\s+/g, ' ').trim();
        
        // Remove periods after words
        from = from.replace(/\./g, '');
        
        // Expand or contract select set of words for consistency
        const replacements = {
            "Nearside": "NS", "Near Side": "NS", "Farside": "FS",
            "Far Side": "FS", "In Front Of": "IFO", "Park And Ride": "P&R",
            "Hs": "High School", "Ctr": "Center", "Hts": "Heights",
            "Trl": "Trail", "Wy": "Way", "Pl": "Place", "Lk": "Lake",
            "Twp": "Township", "Bldg": "Building", "Pk": "Park",
            "MLK": "Martin Luther King"
        };
        
        Object.keys(replacements).forEach(original => {
            from = from.replace(
                new RegExp('\\b' + original + '\\b', 'gi'), replacements[original]);
        });
        
        // Consistent separators
        from = from.replace(/[+@\/&](?=\s+)|(BEFORE|PAST|IFO|X FRO?M)/i, '&');
        
        // De-duplicate word-based separators
        from = from.replace(/(?<=&)\s(BEFORE|PAST|IFO|X FRO?M)\b/gi, '');
        
        // Use the @ separator only for street numbers
        from = from.replace(/&(?=\s[0-9]+$)/, '@');
        
        // Remove thoroughfare suffixes
        const abbreviations = [
            'St', 'Street', 'Rd', 'Road', 'Dr', 'Drive', 'Ct', 'Ln', 'Lane',
            'Blvd', 'Blv', 'Bl', 'Ave', 'Av', 'Avenue', 'Boulevard', 'Hwy',
            'Highway', 'Fwy', 'Freeway', 'Pkwy', 'Parkway'
        ].join('|');
        
        from = from.replace(
            new RegExp('\\s(' + abbreviations + ')\\b(?!\\s\\w[a-z])', 'g'), '');
        
        return from;
    },
    recapitalize: from => {
        from = from.replace(/[\w']*\b/g, word => {
            return !/^(([NESWOI]BD?)|[NS][EW]|[NF]S|P&R)$/i.test(word) ?
                word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() :
                word.toUpperCase();
        });
        
        return from;
    },
    remove: (from, options) => {
        return from.replace(options.target, '').trim();
    }
};

const transformationsMulti = {
    colorContinuity: object => {
        const colors = [
            'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown'
        ];
        
        const name = object.route_long_name ?? object.route_short_name;
        const replaced = colors.some(color => {
            if (new RegExp('\\b' + color + '\\b', 'i').test(name)) {
                object.route_color = color;
                return true;
            }
            
            return false;
        });
        
        if (!replaced) {
            console.warn("Continuity warning: Route '" + name + "' has partially supported color.");
            
            object.route_color = object.route_color.toLowerCase();
            if (!object.route_color.startsWith("#")) {
                object.route_color = "#" + object.route_color;
            }
        }
        
        return object;
    }
};