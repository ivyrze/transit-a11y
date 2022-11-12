export const prettify = (source, options, target) => {
    // Remove duplicate spaces
    source[target] = source[target].replace(/\s\s+/g, ' ').trim();
    
    // Remove periods after words
    source[target] = source[target].replace(/\./g, '');
    
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
        source[target] = source[target].replace(
            new RegExp('\\b' + original + '\\b', 'gi'), replacements[original]);
    });
    
    // Consistent separators
    source[target] = source[target].replace(/[+@\/&](?=\s+)|(BEFORE|PAST|IFO|X FRO?M)/i, '&');
    
    // De-duplicate word-based separators
    source[target] = source[target].replace(/(?<=&)\s(BEFORE|PAST|IFO|X FRO?M)\b/gi, '');
    
    // Use the @ separator only for street numbers
    source[target] = source[target].replace(/&(?=\s[0-9]+$)/, '@');
    
    // Remove thoroughfare suffixes
    const abbreviations = [
        'St', 'Street', 'Rd', 'Road', 'Dr', 'Drive', 'Ct', 'Ln', 'Lane',
        'Blvd', 'Blv', 'Bl', 'Ave', 'Av', 'Avenue', 'Boulevard', 'Hwy',
        'Highway', 'Fwy', 'Freeway', 'Pkwy', 'Parkway'
    ].join('|');
    
    source[target] = source[target].replace(
        new RegExp('\\s(' + abbreviations + ')\\b(?!\\s\\w[a-z])', 'g'), '');
    
    return source;
};