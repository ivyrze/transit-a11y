mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
    container: 'map-container',
    style: styleUrl,
});

map.on('click', [ 'stops-label', 'stops-icon' ], function (e) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: [ 'stops-label', 'stops-icon' ]
    });
    
    if (features) {
        openStop(features[0].properties.stop_id);
    }
});

map.on('mouseenter', [ 'stops-label', 'stops-icon' ], () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', [ 'stops-label', 'stops-icon' ], () => {
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