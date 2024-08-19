import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import Mapbox, { Source, Layer, GeolocateControl } from 'react-map-gl';
import { MapImage } from '@components/map-image';
import { useMapStore, usePerspectiveStore, shallow } from '@hooks/store';
import { useTheme } from '@hooks/theme';
import { useImmutableQuery } from '@hooks/query';
import { styleFactory } from '@assets/mapbox-style';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@assets/styles/components/map.scss';

export const Map = forwardRef((props, ref) => {
    const [
        flyCoords,
        overriddenStopStates,
        clearOverriddenStopStates,
        openedStopHistory,
        clearOpenedStopHistory,
        stopVisibility,
        routeVisibility
    ] = useMapStore(state => [
        state.flyCoords,
        state.overriddenStopStates,
        state.clearOverriddenStopStates,
        state.openedStopHistory,
        state.clearOpenedStopHistory,
        state.stopVisibility,
        state.routeVisibility
    ], shallow);
    
    const { theme } = useTheme();
    const perspective = usePerspectiveStore(state => state.perspective);
    const navigate = useNavigate();
    
    const map = useRef();
    const [ loaded, setLoaded ] = useState(false);
    const geolocateControl = useRef();
    
    const { data } = useImmutableQuery({
        method: 'get',
        url: '/api/map-bounds'
    });
    
    const bounds = data?.bounds;
    
    const mapLayers = useMemo(() => {
        const reversedLayers = styleFactory(theme, overriddenStopStates).reverse();
        return reversedLayers.map((layer, index) => {
            const beforeId = index > 0 ?
                reversedLayers[index - 1]?.id :
                "settlement-minor-label";

            let filter;
            if (stopVisibility.length && layer.id.startsWith("stop")) {
                filter = [
                    "in", ["get", "stop_id"], ["literal", stopVisibility]
                ];
            } else if (routeVisibility.length && layer.id.startsWith("route")) {
                filter = [
                    "in", ["get", "route_id"], ["literal", routeVisibility]
                ];
            }
            
            return (
                <Layer
                    key={ layer.id }
                    beforeId={ beforeId }
                    { ...(filter && { filter }) }
                    { ...layer }
                />
            );
        });
    }, [ theme, overriddenStopStates, stopVisibility, routeVisibility ]);
    
    useImperativeHandle(ref, () => ({
        triggerGeolocation: () => geolocateControl.current?.trigger()
    }));
    
    useEffect(() => {
        if (!loaded || !flyCoords) { return; }
        
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
    }, [ loaded, flyCoords ]);
    
    useEffect(() => {
        if (!loaded) { return; }
        
        const setStopFeatureState = (stop, state) => {
            map.current?.setFeatureState({
                source: 'internal-api',
                sourceLayer: 'stops',
                id: stop
            }, state);
        };
        
        Object.keys(overriddenStopStates).forEach(stop => {
            setStopFeatureState(stop, { accessibility: overriddenStopStates[stop] });
        });
        
        Object.keys(openedStopHistory).forEach(stop => {
            setStopFeatureState(stop, { opened: openedStopHistory[stop] });
        });
    }, [ loaded, openedStopHistory ]);
    
    useEffect(() => {
        return () => {
            clearOverriddenStopStates();
            clearOpenedStopHistory();
        };
    }, [ clearOverriddenStopStates, clearOpenedStopHistory ]);
    
    const interactiveLayers = [ "stops-icon", "stops-label" ];
    
    const mapImages = useMemo(() => {
        const icons = import.meta.glob('../assets/images/map-*.png', {
            query: '?url', import: 'default', eager: true
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
                    tiles={[ `/api/map-tiles/${perspective}/{z}/{x}/{y}` ]}
                    promoteId={{ 'stops':'stop_id','routes':'route_id' }}
                    minzoom={ 8 }
                    maxzoom={ 16 }
                >
                    { mapLayers }
                </Source>
                { mapImages }
            </Mapbox>
        </div>
    );
});