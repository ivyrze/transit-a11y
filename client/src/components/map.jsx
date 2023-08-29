import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import Mapbox, { Source, Layer, GeolocateControl } from 'react-map-gl';
import { MapImage } from '@components/map-image';
import { useMapStore } from '@hooks/store';
import { useTheme } from '@hooks/theme';
import { useImmutableQuery } from '@hooks/query';
import styles from '@assets/mapbox-style.json';

export const Map = forwardRef((props, ref) => {
    const { onRouteListUpdate } = props;
    
    const [
        startupAgency,
        flyCoords,
        setCameraCoords,
        shouldQueryRoutes,
        setRouteList
    ] = useMapStore(state => [
        state.startupAgency,
        state.flyCoords,
        state.setCameraCoords,
        state.shouldQueryRoutes,
        state.setRouteList
    ]);
    
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { agency } = useParams();
    
    const map = useRef();
    const [ loaded, setLoaded ] = useState(false);
    const geolocateControl = useRef();
    
    const { data } = useImmutableQuery({
        method: 'post',
        url: '/api/map-bounds',
        ...(startupAgency && { data: { agency: startupAgency } })
    });
    
    const bounds = data?.bounds;
    
    useImperativeHandle(ref, () => ({
        triggerGeolocation: () => geolocateControl.current?.trigger()
    }));
    
    const queryRenderedRoutes = useCallback(() => {
        if (!shouldQueryRoutes) { return; }
        
        const query = map.current.queryRenderedFeatures({
            layers: [ "route-primary" ]
        });
        
        // De-duplicate and sort route matches
        let routes = {};
        query.forEach(route => routes[route.id] = route.properties);
        
        routes = Object.values(routes).sort((a, b) => {
            return a.route_short_name.localeCompare(b.route_short_name, undefined, { numeric: true });
        });
        
        setRouteList(routes);
    }, [ shouldQueryRoutes, setRouteList ]);
    
    useEffect(() => {
        if (!bounds) { return; }
        setCameraCoords({
            viewState: {
                longitude: (bounds[0] + bounds[2]) / 2,
                latitude: (bounds[1] + bounds[3]) / 2
            }
        });
    }, [ bounds, setCameraCoords ]);
    
    useEffect(() => {
        if (!loaded) { return; }
        queryRenderedRoutes();
    }, [ loaded, queryRenderedRoutes ]);
    
    useEffect(() => {
        let padding = {};
        if (window.innerWidth > 768) {
            padding.left = 400;
        }
        
        map.current?.flyTo({
            center: flyCoords,
            padding: padding,
            zoom: 16,
            duration: 2500,
            essential: false
        });
    }, [ flyCoords ]);
    
    const interactiveLayers = [ "stops-icon", "stops-label" ];
    
    const mapImages = useMemo(() => {
        const icons = import.meta.glob('../assets/images/map-*.png', {
            as: 'url', eager: true
        });
        
        return Object.keys(icons).map(icon => {
            const filename = icon.split('-').slice(1).join('-');
            const name = filename.replace(".png", "");
            
            return (
                <MapImage
                    key={ name }
                    name={ name }
                    src={ icons[icon] }
                />
            );
        });
    }, []);
    
    const handleLoad = () => setLoaded(true);
        
    const handleMove = event => {
        setCameraCoords(event);
        queryRenderedRoutes();
    };
    
    const handleClick = event => {
        if (event.features.length) {
            navigate('/stop/' + event.features[0].id);
        }
    };
    
    const handleMouseEnter = () => {
        map.current.getCanvas().style.cursor = "pointer";
    };
    
    const handleMouseLeave = () => {
        map.current.getCanvas().style.cursor = "";
    };
    
    const prefixHostname = (url, type) => {
        if (url.startsWith('/')) {
            return { url: window.location.origin + url, type };
        }
    };
    
    const accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_ACCESS_TOKEN;
    const mapStyle = theme === "light-mode" ?
        import.meta.env.VITE_MAPBOX_LIGHT_STYLE_URL :
        import.meta.env.VITE_MAPBOX_DARK_STYLE_URL;
        
    if (!theme || !bounds) { return null; }
    
    return (
        <div id="map-container">
            <Mapbox
                ref={ map }
                mapLib={ MapboxGL }
                mapboxAccessToken={ accessToken }
                mapStyle={ mapStyle }
                bounds={ bounds }
                fitBoundsOptions={{ padding: 72 }}
                transformRequest={ prefixHostname }
                onLoad={ handleLoad }
                onMove={ handleMove }
                onClick={ handleClick }
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }
                interactiveLayerIds={ interactiveLayers }
            >
                <GeolocateControl
                    ref={ geolocateControl }
                    trackUserLocation={ true }
                    showUserHeading={ true }
                    style={{ display: 'none' }}
                />
                <Source
                    id="internal-api"
                    type="vector"
                    tiles={[ '/api/map-tiles/{z}/{x}/{y}' ]}
                    promoteId={{ 'stops':'stop_id','routes':'route_id' }}
                    minzoom={ 8 }
                    maxzoom={ 16 }
                >
                    { styles[theme].map(layer => (
                        <Layer
                            key={ layer.id }
                            beforeId="settlement-minor-label"
                            { ...layer }
                        / >
                    )) }
                </Source>
                { mapImages }
            </Mapbox>
        </div>
    );
});