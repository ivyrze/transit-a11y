mapboxgl.accessToken = options.accessToken;
const map = new mapboxgl.Map({
    container: 'map-container',
    style: prefersLightScheme() ? options.lightStyleUrl : options.darkStyleUrl,
    bounds: options.mapBounds,
    fitBoundsOptions: { padding: 72 }
});

const layers = [
    'stops-icon',
    'stops-label',
    'stops-label-warning'
];

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    map.setStyle(prefersLightScheme() ? options.lightStyleUrl : options.darkStyleUrl);
});

map.on('load', getAlerts);

map.on('click', layers, function (e) {
    const features = map.queryRenderedFeatures(e.point, { layers });
    
    if (features) {
        openStop(features[0].properties.stop_id);
    }
});

map.on('mouseenter', layers, () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', layers, () => {
    map.getCanvas().style.cursor = '';
});

const flyToStop = coordinates => {
    let padding = {};
    if ($(window).width() > 768) {
        padding.left = 400;
    }
    
    map.flyTo({
        center: coordinates,
        padding: padding,
        zoom: 16,
        duration: 2500,
        essential: false
    });
};

const updateMapAlerts = alerts => {
    const filter = [
        [
            'index-of',
            ['get', 'stop_id'],
            ['literal', alerts]
        ], -1
    ];
    map.setFilter('stops-label', ['==', ...filter]);
    map.setFilter('stops-label-warning', ['!=', ...filter]);
};