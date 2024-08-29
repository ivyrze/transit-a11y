import { accessibilityStates, getStateGroup } from '$lib/a11y-states';
import { themeStore, perspectiveStore, mapStore } from '$lib/stores.svelte';
import { PUBLIC_PROTOMAPS_API_KEY } from '$env/static/public';

export const styleFactory = () => {
    const { isLight } = themeStore;
    const layers = layersFactory();

    return {
        "version": 8,
        "sources": {
            "protomaps": {
                "type": "vector",
                "attribution": "<a href=\"https://github.com/protomaps/basemaps\">Protomaps</a> © <a href=\"https://openstreetmap.org\">OpenStreetMap</a>",
                "url": "https://api.protomaps.com/tiles/v3.json?key=" + PUBLIC_PROTOMAPS_API_KEY
            },
            "api": {
                "type": "vector",
                "tiles": [
                    "/api/map-tiles/" + perspectiveStore.perspective + "/{z}/{x}/{y}"
                ],
                "promoteId": {
                    "stops": "stop_id",
                    "routes": "route_id"
                }
            }
        },
        "sprite": "/images/map-sprites",
        "glyphs": "/fonts/{fontstack}/{range}.pbf",
        "layers": [
            {
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": isLight ? "#ffffff" : "#2b2b2b"
                }
            },
            {
                "id": "earth",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "earth",
                "paint": {
                    "fill-color": isLight ? "#ffffff" : "#141414"
                }
            },
            {
                "id": "landuse_park",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "national_park",
                        "park",
                        "cemetery",
                        "protected_area",
                        "nature_reserve",
                        "forest",
                        "golf_course"
                    ]
                ],
                "paint": {
                    "fill-color": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        isLight ? "#fcfcfc" : "#181818",
                        12,
                        isLight ? "#fcfcfc" : "#181818"
                    ]
                }
            },
            {
                "id": "landuse_urban_green",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "allotments",
                        "village_green",
                        "playground"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#fcfcfc" : "#181818",
                    "fill-opacity": 0.7
                }
            },
            {
                "id": "landuse_hospital",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "hospital"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f8f8f8" : "#1d1d1d"
                }
            },
            {
                "id": "landuse_industrial",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "industrial"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#fcfcfc" : "#101010"
                }
            },
            {
                "id": "landuse_school",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "school",
                        "university",
                        "college"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f8f8f8" : "#111111"
                }
            },
            {
                "id": "landuse_beach",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "beach"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f6f6f6" : "#1f1f1f"
                }
            },
            {
                "id": "landuse_zoo",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "zoo"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f7f7f7" : "#191919"
                }
            },
            {
                "id": "landuse_military",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "military",
                        "naval_base",
                        "airfield"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f7f7f7" : "#191919"
                }
            },
            {
                "id": "natural_wood",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "natural",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "wood",
                        "nature_reserve",
                        "forest"
                    ]
                ],
                "paint": {
                    "fill-color": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        isLight ? "#fafafa" : "#1a1a1a",
                        12,
                        isLight ? "#fafafa" : "#1a1a1a"
                    ]
                }
            },
            {
                "id": "natural_scrub",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "natural",
                "filter": [
                    "in",
                    "pmap:kind",
                    "scrub",
                    "grassland",
                    "grass"
                ],
                "paint": {
                    "fill-color": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        isLight ? "#fafafa" : "#1c1c1c",
                        12,
                        isLight ? "#fafafa" : "#1c1c1c"
                    ]
                }
            },
            {
                "id": "natural_glacier",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "natural",
                "filter": [
                    "==",
                    "pmap:kind",
                    "glacier"
                ],
                "paint": {
                    "fill-color": isLight ? "#fcfcfc" : "#191919"
                }
            },
            {
                "id": "natural_sand",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "natural",
                "filter": [
                    "==",
                    "pmap:kind",
                    "sand"
                ],
                "paint": {
                    "fill-color": isLight ? "#fafafa" : "#161616"
                }
            },
            {
                "id": "landuse_aerodrome",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "aerodrome"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#fdfdfd" : "#191919"
                }
            },
            {
                "id": "transit_runway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "transit",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind_detail",
                        "runway"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#efefef" : "#323232",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        10,
                        0,
                        12,
                        4,
                        18,
                        30
                    ]
                }
            },
            {
                "id": "transit_taxiway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "transit",
                "minzoom": 13,
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind_detail",
                        "taxiway"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#efefef" : "#323232",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        15,
                        6
                    ]
                }
            },
            {
                "id": "water",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "water",
                "paint": {
                    "fill-color": isLight ? "#dcdcdc" : "#333333"
                }
            },
            {
                "id": "physical_line_stream",
                "type": "line",
                "source": "protomaps",
                "source-layer": "physical_line",
                "minzoom": 14,
                "filter": [
                    "all",
                    [
                        "in",
                        "pmap:kind",
                        "stream"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#dcdcdc" : "#333333",
                    "line-width": 0.5
                }
            },
            {
                "id": "physical_line_river",
                "type": "line",
                "source": "protomaps",
                "source-layer": "physical_line",
                "minzoom": 9,
                "filter": [
                    "all",
                    [
                        "in",
                        "pmap:kind",
                        "river"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#dcdcdc" : "#333333",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        9,
                        0,
                        9.5,
                        1,
                        18,
                        12
                    ]
                }
            },
            {
                "id": "landuse_pedestrian",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "pedestrian"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#fdfdfd" : "#191919"
                }
            },
            {
                "id": "landuse_pier",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "landuse",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "pier"
                    ]
                ],
                "paint": {
                    "fill-color": isLight ? "#f5f5f5" : "#0a0a0a"
                }
            },
            {
                "id": "roads_tunnels_other_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "in",
                        "pmap:kind",
                        "other",
                        "path"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#101010",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        14,
                        0,
                        20,
                        7
                    ]
                }
            },
            {
                "id": "roads_tunnels_minor_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#fcfcfc" : "#101010",
                    "line-dasharray": [
                        3,
                        2
                    ],
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        0,
                        12.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_tunnels_link_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#fcfcfc" : "#101010",
                    "line-dasharray": [
                        3,
                        2
                    ],
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        0,
                        12.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_tunnels_medium_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#fcfcfc" : "#101010",
                    "line-dasharray": [
                        3,
                        2
                    ],
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        0.5,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        10,
                        0,
                        10.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_tunnels_major_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#fcfcfc" : "#101010",
                    "line-dasharray": [
                        3,
                        2
                    ],
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        0.5,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        9,
                        0,
                        9.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_tunnels_highway_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#fcfcfc" : "#101010",
                    "line-dasharray": [
                        6,
                        0.5
                    ],
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        3.5,
                        0.5,
                        18,
                        15
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        1,
                        20,
                        15
                    ]
                }
            },
            {
                "id": "roads_tunnels_other",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "in",
                        "pmap:kind",
                        "other",
                        "path"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-dasharray": [
                        4.5,
                        0.5
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        14,
                        0,
                        20,
                        7
                    ]
                }
            },
            {
                "id": "roads_tunnels_minor",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_tunnels_link",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_tunnels_medium",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        12,
                        1.2,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_tunnels_major",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        6,
                        0,
                        12,
                        1.6,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_tunnels_highway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "<",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        6,
                        1.1,
                        12,
                        1.6,
                        15,
                        5,
                        18,
                        15
                    ]
                }
            },
            {
                "id": "buildings",
                "type": "fill",
                "source": "protomaps",
                "source-layer": "buildings",
                "paint": {
                    "fill-color": isLight ? "#efefef" : "#0a0a0a",
                    "fill-opacity": 0.5
                }
            },
            {
                "id": "transit_pier",
                "type": "line",
                "source": "protomaps",
                "source-layer": "transit",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "pier"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#efefef" : "#0a0a0a",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        0,
                        12.5,
                        0.5,
                        20,
                        16
                    ]
                }
            },
            {
                "id": "roads_minor_service_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 13,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ],
                    [
                        "==",
                        "pmap:kind_detail",
                        "service"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        18,
                        8
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        0.8
                    ]
                }
            },
            {
                "id": "roads_minor_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ],
                    [
                        "!=",
                        "pmap:kind_detail",
                        "service"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        0,
                        12.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_link_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 13,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1.5
                    ]
                }
            },
            {
                "id": "roads_medium_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        12,
                        1.2,
                        15,
                        3,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        10,
                        0,
                        10.5,
                        1.5
                    ]
                }
            },
            {
                "id": "roads_major_casing_late",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        6,
                        0,
                        12,
                        1.6,
                        15,
                        3,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        9,
                        0,
                        9.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_highway_casing_late",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        3.5,
                        0.5,
                        18,
                        15
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        1,
                        20,
                        15
                    ]
                }
            },
            {
                "id": "roads_other",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "in",
                        "pmap:kind",
                        "other",
                        "path"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#f5f5f5" : "#1f1f1f",
                    "line-dasharray": [
                        3,
                        1
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        14,
                        0,
                        20,
                        7
                    ]
                }
            },
            {
                "id": "roads_link",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#1f1f1f",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_minor_service",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ],
                    [
                        "==",
                        "pmap:kind_detail",
                        "service"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#f5f5f5" : "#1f1f1f",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        18,
                        8
                    ]
                }
            },
            {
                "id": "roads_minor",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ],
                    [
                        "!=",
                        "pmap:kind_detail",
                        "service"
                    ]
                ],
                "paint": {
                    "line-color": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        isLight ? "#ebebeb" : "#292929",
                        16,
                        isLight ? "#f5f5f5" : "#1f1f1f"
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_medium",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        12,
                        1.2,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_major_casing_early",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "maxzoom": 12,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        0.5,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        9,
                        0,
                        9.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_major",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        6,
                        0,
                        12,
                        1.6,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_highway_casing_early",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "maxzoom": 12,
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        3.5,
                        0.5,
                        18,
                        15
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        1
                    ]
                }
            },
            {
                "id": "roads_highway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        6,
                        1.1,
                        12,
                        1.6,
                        15,
                        5,
                        18,
                        15
                    ]
                }
            },
            {
                "id": "transit_railway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "transit",
                "filter": [
                    "all",
                    [
                        "==",
                        "pmap:kind",
                        "rail"
                    ]
                ],
                "paint": {
                    "line-dasharray": [
                        0.3,
                        0.75
                    ],
                    "line-opacity": 0.5,
                    "line-color": isLight ? "#d6d6d6" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        6,
                        0.15,
                        18,
                        9
                    ]
                }
            },
            {
                "id": "boundaries_country",
                "type": "line",
                "source": "protomaps",
                "source-layer": "boundaries",
                "filter": [
                    "<=",
                    "pmap:min_admin_level",
                    2
                ],
                "paint": {
                    "line-color": isLight ? "#adadad" : "#707070",
                    "line-width": 1,
                    "line-dasharray": [
                        3,
                        2
                    ]
                }
            },
            {
                "id": "boundaries",
                "type": "line",
                "source": "protomaps",
                "source-layer": "boundaries",
                "filter": [
                    ">",
                    "pmap:min_admin_level",
                    2
                ],
                "paint": {
                    "line-color": isLight ? "#adadad" : "#707070",
                    "line-width": 0.5,
                    "line-dasharray": [
                        3,
                        2
                    ]
                }
            },
            {
                "id": "roads_bridges_other_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "in",
                        "pmap:kind",
                        "other",
                        "path"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        14,
                        0,
                        20,
                        7
                    ]
                }
            },
            {
                "id": "roads_bridges_link_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        0,
                        12.5,
                        1.5
                    ]
                }
            },
            {
                "id": "roads_bridges_minor_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        0.8
                    ]
                }
            },
            {
                "id": "roads_bridges_medium_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        12,
                        1.2,
                        15,
                        3,
                        18,
                        13
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        10,
                        0,
                        10.5,
                        1.5
                    ]
                }
            },
            {
                "id": "roads_bridges_major_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        0.5,
                        18,
                        10
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        9,
                        0,
                        9.5,
                        1.5
                    ]
                }
            },
            {
                "id": "roads_bridges_other",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "in",
                        "pmap:kind",
                        "other",
                        "path"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#f5f5f5" : "#1f1f1f",
                    "line-dasharray": [
                        2,
                        1
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        14,
                        0,
                        20,
                        7
                    ]
                }
            },
            {
                "id": "roads_bridges_minor",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "minor_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#f5f5f5" : "#1f1f1f",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        0,
                        12.5,
                        0.5,
                        15,
                        2,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_bridges_link",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#f5f5f5" : "#1f1f1f",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        13,
                        0,
                        13.5,
                        1,
                        18,
                        11
                    ]
                }
            },
            {
                "id": "roads_bridges_medium",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "medium_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        12,
                        1.2,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_bridges_major",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "major_road"
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        6,
                        0,
                        12,
                        1.6,
                        15,
                        3,
                        18,
                        13
                    ]
                }
            },
            {
                "id": "roads_bridges_highway_casing",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 12,
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ffffff" : "#141414",
                    "line-gap-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        3.5,
                        0.5,
                        18,
                        15
                    ],
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        7,
                        0,
                        7.5,
                        1,
                        20,
                        15
                    ]
                }
            },
            {
                "id": "roads_bridges_highway",
                "type": "line",
                "source": "protomaps",
                "source-layer": "roads",
                "filter": [
                    "all",
                    [
                        ">",
                        "pmap:level",
                        0
                    ],
                    [
                        "==",
                        "pmap:kind",
                        "highway"
                    ],
                    [
                        "!=",
                        "pmap:link",
                        1
                    ]
                ],
                "paint": {
                    "line-color": isLight ? "#ebebeb" : "#292929",
                    "line-width": [
                        "interpolate",
                        [
                            "exponential",
                            1.6
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        6,
                        1.1,
                        12,
                        1.6,
                        15,
                        5,
                        18,
                        15
                    ]
                }
            },
            {
                "id": "physical_line_waterway_label",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "physical_line",
                "minzoom": 13,
                "filter": [
                    "all",
                    [
                        "in",
                        "pmap:kind",
                        "river",
                        "stream"
                    ]
                ],
                "layout": {
                    "symbol-placement": "line",
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": 12,
                    "text-letter-spacing": 0.3
                },
                "paint": {
                    "text-color": isLight ? "#adadad" : "#707070"
                }
            },
            {
                "id": "physical_point_peak",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "physical_point",
                "filter": [
                    "any",
                    [
                        "==",
                        "pmap:kind",
                        "peak"
                    ]
                ],
                "layout": {
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        10,
                        8,
                        16,
                        12
                    ],
                    "text-letter-spacing": 0.1,
                    "text-max-width": 9
                },
                "paint": {
                    "text-color": isLight ? "#adadad" : "#707070",
                    "text-halo-width": 1.5
                }
            },
            ...layers.routes,
            {
                "id": "roads_labels_minor",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 15,
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "minor_road",
                        "other",
                        "path"
                    ]
                ],
                "layout": {
                    "symbol-sort-key": [
                        "get",
                        "pmap:min_zoom"
                    ],
                    "symbol-placement": "line",
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": 12
                },
                "paint": {
                    "text-color": isLight ? "#adadad" : "#525252",
                    "text-halo-color": isLight ? "#ffffff" : "#141414",
                    "text-halo-width": 2
                }
            },
            {
                "id": "physical_point_ocean",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "physical_point",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "sea",
                        "ocean",
                        "lake",
                        "water",
                        "bay",
                        "strait",
                        "fjord"
                    ]
                ],
                "layout": {
                    "text-font": [
                        "akzidenz-medium"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        10,
                        10,
                        12
                    ],
                    "text-letter-spacing": 0.1,
                    "text-max-width": 9,
                    "text-transform": "uppercase"
                },
                "paint": {
                    "text-color": isLight ? "#adadad" : "#707070"
                }
            },
            {
                "id": "physical_point_lakes",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "physical_point",
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "lake",
                        "water"
                    ]
                ],
                "layout": {
                    "text-font": [
                        "akzidenz-medium"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        0,
                        6,
                        12,
                        10,
                        12
                    ],
                    "text-letter-spacing": 0.1,
                    "text-max-width": 9
                },
                "paint": {
                    "text-color": isLight ? "#adadad" : "#707070"
                }
            },
            {
                "id": "roads_labels_major",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "roads",
                "minzoom": 11,
                "filter": [
                    "any",
                    [
                        "in",
                        "pmap:kind",
                        "highway",
                        "major_road",
                        "medium_road"
                    ]
                ],
                "layout": {
                    "symbol-sort-key": [
                        "get",
                        "pmap:min_zoom"
                    ],
                    "symbol-placement": "line",
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-field": [
                        "get",
                        "name"
                    ],
                    "text-size": 12
                },
                "paint": {
                    "text-color": isLight ? "#999999" : "#5c5c5c",
                    "text-halo-color": isLight ? "#ffffff" : "#141414",
                    "text-halo-width": 2
                }
            },
            {
                "id": "places_subplace",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "places",
                "filter": [
                    "==",
                    "pmap:kind",
                    "neighbourhood"
                ],
                "layout": {
                    "symbol-sort-key": [
                        "get",
                        "pmap:min_zoom"
                    ],
                    "text-field": "{name}",
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-max-width": 7,
                    "text-letter-spacing": 0.1,
                    "text-padding": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        5,
                        2,
                        8,
                        4,
                        12,
                        18,
                        15,
                        20
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "exponential",
                            1.2
                        ],
                        [
                            "zoom"
                        ],
                        11,
                        8,
                        14,
                        14,
                        18,
                        24
                    ],
                    "text-transform": "uppercase"
                },
                "paint": {
                    "text-color": isLight ? "#8f8f8f" : "#5c5c5c",
                    "text-halo-color": isLight ? "#ffffff" : "#141414",
                    "text-halo-width": 1.5
                }
            },
            ...layers.stops,
            {
                "id": "places_locality",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "places",
                "filter": [
                    "==",
                    "pmap:kind",
                    "locality"
                ],
                "layout": {
                    "icon-image": [
                        "step",
                        [
                            "zoom"
                        ],
                        "townspot",
                        8,
                        ""
                    ],
                    "icon-size": 0.7,
                    "text-field": "{name}",
                    "text-font": [
                        "case",
                        [
                            "<=",
                            [
                                "get",
                                "pmap:min_zoom"
                            ],
                            5
                        ],
                        [
                            "literal",
                            [
                                "akzidenz-medium"
                            ]
                        ],
                        [
                            "literal",
                            [
                                "akzidenz-regular"
                            ]
                        ]
                    ],
                    "text-padding": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        5,
                        3,
                        8,
                        7,
                        12,
                        11
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        2,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                13
                            ],
                            8,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                13
                            ],
                            13,
                            0
                        ],
                        4,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                13
                            ],
                            10,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                13
                            ],
                            15,
                            0
                        ],
                        6,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                12
                            ],
                            11,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                12
                            ],
                            17,
                            0
                        ],
                        8,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                11
                            ],
                            11,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                11
                            ],
                            18,
                            0
                        ],
                        10,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                9
                            ],
                            12,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                9
                            ],
                            20,
                            0
                        ],
                        15,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                8
                            ],
                            12,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                8
                            ],
                            22,
                            0
                        ]
                    ],
                    "icon-padding": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        0,
                        8,
                        4,
                        10,
                        8,
                        12,
                        6,
                        22,
                        2
                    ],
                    "text-anchor": [
                        "step",
                        [
                            "zoom"
                        ],
                        "left",
                        8,
                        "center"
                    ],
                    "text-radial-offset": 0.4
                },
                "paint": {
                    "text-color": isLight ? "#5c5c5c" : "#999999",
                    "text-halo-color": isLight ? "#ffffff" : "#141414",
                    "text-halo-width": 1
                }
            },
            {
                "id": "places_region",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "places",
                "filter": [
                    "==",
                    "pmap:kind",
                    "region"
                ],
                "layout": {
                    "symbol-sort-key": [
                        "get",
                        "pmap:min_zoom"
                    ],
                    "text-field": [
                        "step",
                        [
                            "zoom"
                        ],
                        [
                            "get",
                            "name:short"
                        ],
                        6,
                        [
                            "get",
                            "name"
                        ]
                    ],
                    "text-font": [
                        "akzidenz-regular"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        11,
                        7,
                        16
                    ],
                    "text-radial-offset": 0.2,
                    "text-anchor": "center",
                    "text-transform": "uppercase"
                },
                "paint": {
                    "text-color": isLight ? "#b3b3b3" : "#3d3d3d",
                    "text-halo-color": isLight ? "#ffffff" : "#141414",
                    "text-halo-width": 2
                }
            },
            {
                "id": "places_country",
                "type": "symbol",
                "source": "protomaps",
                "source-layer": "places",
                "filter": [
                    "==",
                    "pmap:kind",
                    "country"
                ],
                "layout": {
                    "symbol-sort-key": [
                        "get",
                        "pmap:min_zoom"
                    ],
                    "text-field": "{name}",
                    "text-font": [
                        "akzidenz-medium"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        2,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                10
                            ],
                            8,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                10
                            ],
                            12,
                            0
                        ],
                        6,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                8
                            ],
                            10,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                8
                            ],
                            18,
                            0
                        ],
                        8,
                        [
                            "case",
                            [
                                "<",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                7
                            ],
                            11,
                            [
                                ">=",
                                [
                                    "get",
                                    "pmap:population_rank"
                                ],
                                7
                            ],
                            20,
                            0
                        ]
                    ],
                    "icon-padding": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        2,
                        14,
                        2,
                        16,
                        20,
                        17,
                        2,
                        22,
                        2
                    ],
                    "text-transform": "uppercase"
                },
                "paint": {
                    "text-color": isLight ? "#b8b8b8" : "#707070"
                }
            }
        ]
    }
};

const layersFactory = () => {
    const { isLight } = themeStore;
    const {
        stopVisibility,
        routeVisibility,
        overriddenStopStates
    } = mapStore;

    let accessibilityStyles = {};
    [ ...accessibilityStates.keys() ].forEach(state => {
        const style = getStateGroup(state).style;
        accessibilityStyles[style] ??= [];
        accessibilityStyles[style].push(state);
    });
    accessibilityStyles = Object.entries(accessibilityStyles);

    const stateInput =
        ["get", "wheelchair_boarding"];
    const overriddenStopMatch =
        Object.entries(overriddenStopStates).flat();
    
    const getAccessibilityStyle = [
        "case",
        ...accessibilityStyles.map(([ style, states ]) => ([
            [
                "in",
                Object.keys(overriddenStopStates).length ?
                [
                    "match",
                    ["get", "stop_id"],
                    ...overriddenStopMatch,
                    stateInput
                ] :
                stateInput,
                ["literal", states]
            ],
            style
        ])).flat(1),
        "unknown"
    ];

    const getIconName = [
        "concat",
        getAccessibilityStyle,
        "-" + (isLight ? "light" : "dark")
    ];

    const getVisibilityFilter = (field, visibility) => {
        return visibility.length ? [
            "in", ["get", field], ["literal", visibility]
        ] : true;
    };
    
    const routeLayers = [
        {
            "id": "route-outline",
            "type": "line",
            "source": "api",
            "source-layer": "routes",
            "minzoom": 8,
            "filter": getVisibilityFilter(
                'route_id', routeVisibility
            ),
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
            "source": "api",
            "source-layer": "routes",
            "minzoom": 8,
            "filter": getVisibilityFilter(
                'route_id', routeVisibility
            ),
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
        }
    ];

    const stopLayers = [
        {
            "id": "stop-opened",
            "type": "circle",
            "source": "api",
            "source-layer": "stops",
            "minzoom": 12,
            "filter": getVisibilityFilter(
                'stop_id', stopVisibility
            ),
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
            "source": "api",
            "source-layer": "stops",
            "minzoom": 8,
            "filter": getVisibilityFilter(
                'stop_id', stopVisibility
            ),
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
                    getAccessibilityStyle,
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
                    getAccessibilityStyle,
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
            "source": "api",
            "source-layer": "stops",
            "minzoom": 11,
            "filter": getVisibilityFilter(
                'stop_id', stopVisibility
            ),
            "layout": {
                "text-optional": true,
                "text-size": 17,
                "icon-image": [
                    "step",
                    ["zoom"],
                    "",
                    14,
                    getIconName
                ],
                "icon-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    14,
                    0.6,
                    20,
                    1
                ],
                "text-font": [
                    "akzidenz-medium"
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

    return {
        stops: stopLayers,
        routes: routeLayers
    };
};