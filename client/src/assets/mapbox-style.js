export const styleFactory = (theme, overriddenStopStyles) => {
    const isLight = theme === "light-mode";
    
    const iconSuffix = isLight ? "light" : "dark";
    const baseIcon = ["concat", ["get", "wheelchair_boarding"], "-" + iconSuffix];
    
    const overriddenIcons = Object.entries(overriddenStopStyles).map(entry => {
        entry[1] = entry[1] + "-" + iconSuffix;
        return entry;
    }).flat();
    
    return [
        {
            "id": "route-outline",
            "type": "line",
            "source": "internal-api",
            "source-layer": "routes",
            "minzoom": 8,
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 2],
                    ["zoom"],
                    8,
                    4,
                    20,
                    210,
                    22,
                    430
                ],
                "line-color": isLight ?
                    "hsl(0, 0%, 82%)" :
                    "hsl(0, 0%, 6%)",
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    0,
                    9.5,
                    0.25
                ]
            }
        },
        {
            "id": "route-primary",
            "type": "line",
            "source": "internal-api",
            "source-layer": "routes",
            "minzoom": 8,
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 2],
                    ["zoom"],
                    8,
                    4,
                    20,
                    120,
                    22,
                    280
                ],
                "line-color": isLight ?
                    "hsl(0, 0%, 82%)" :
                    "hsl(0, 0%, 6%)",
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8.5,
                    0,
                    9.5,
                    1
                ]
            }
        },
        {
            "id": "stop-opened",
            "type": "circle",
            "source": "internal-api",
            "source-layer": "stops",
            "minzoom": 12,
            "paint": {
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    12,
                    2,
                    15,
                    12,
                    20,
                    40
                ],
                "circle-opacity": ["case", ["!=", ["feature-state", "opened"], true], 0, 0.25],
                "circle-color": isLight ? "#999999" : "#777777"
            }
        },
        {
            "id": "stops-icon",
            "type": "circle",
            "source": "internal-api",
            "source-layer": "stops",
            "minzoom": 8,
            "paint": {
                "circle-translate": [0, 0],
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    9,
                    2,
                    12,
                    3,
                    20,
                    12
                ],
                "circle-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    ["case", ["==", ["get", "is_major"], false], 0, 0],
                    8.5,
                    ["case", ["==", ["get", "is_major"], false], 0, 1],
                    12,
                    ["case", ["==", ["get", "is_major"], false], 0, 1],
                    12.5,
                    ["case", ["==", ["get", "is_major"], false], 1, 1]
                ],
                "circle-stroke-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    11,
                    0.5,
                    20,
                    ["case", ["!=", ["feature-state", "opened"], true], 2, 3]
                ],
                "circle-stroke-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    ["case", ["==", ["get", "is_major"], false], 0, 0],
                    9,
                    ["case", ["==", ["get", "is_major"], false], 0, 1],
                    12,
                    ["case", ["==", ["get", "is_major"], false], 0, 1],
                    12.5,
                    ["case", ["==", ["get", "is_major"], false], 1, 1]
                ],
                "circle-color": [
                    "match",
                    [
                        "coalesce",
                        ["feature-state", "style"],
                        ["get", "wheelchair_boarding"]
                    ],
                    ["inaccessible"],
                    isLight ? "#ff7d7d" : "#361717",
                    ["warning"],
                    isLight ? "#ffd57c" : "#372a15",
                    ["accessible"],
                    isLight ? "#85a2ff" : "#242e4f",
                    isLight ? "#b1b1b1" : "#222222"
                ],
                "circle-stroke-color": [
                    "match",
                    [
                        "coalesce",
                        ["feature-state", "style"],
                        ["get", "wheelchair_boarding"]
                    ],
                    ["inaccessible"],
                    isLight ? "#811616" : "#fdacac",
                    ["warning"],
                    isLight ? "#6d4c07" : "#f2c789",
                    ["accessible"],
                    isLight ? "#1a358f" : "#b2c2ff",
                    isLight ? "#464646" : "#c1c1c1"
                ]
            }
        },
        {
            "id": "stops-label",
            "type": "symbol",
            "source": "internal-api",
            "source-layer": "stops",
            "minzoom": 11,
            "layout": {
                "text-optional": true,
                "text-size": 17,
                "icon-image": [
                    "step",
                    ["zoom"],
                    "",
                    14,
                    overriddenIcons.length ? [
                        "match",
                        ["get", "stop_id"],
                        ...overriddenIcons,
                        baseIcon
                    ] : baseIcon
                ],
                "icon-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    14,
                    0.3,
                    20,
                    0.5
                ],
                "text-font": [
                    "Akzidenz-Grotesk Std Med Regular",
                    "Arial Unicode MS Regular"
                ],
                "icon-allow-overlap": true,
                "text-padding": 6,
                "text-offset": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    9,
                    ["literal", [0, -0.10]],
                    20,
                    ["literal", [0, -1.20]]
                ],
                "icon-optional": true,
                "text-anchor": "bottom",
                "text-field": ["to-string", ["get", "stop_name"]],
                "text-letter-spacing": -0.01,
                "icon-padding": 5,
                "text-max-width": 8
            },
            "paint": {
                "text-halo-color": isLight ?
                    "hsla(0, 0%, 96%, 0.85)" :
                    "hsla(0, 0%, 13%, 0.45)",
                "text-color": isLight ?
                    "hsl(0, 0%, 25%)" :
                    "#f9f9f9",
                "icon-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    14,
                    0,
                    14.5,
                    1
                ],
                "text-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    14,
                    ["case", ["==", ["get", "is_major"], false], 0, 1],
                    14.5,
                    ["case", ["==", ["get", "is_major"], false], 1, 1]
                ],
                "text-halo-width": 4
            }
        }
    ];
};