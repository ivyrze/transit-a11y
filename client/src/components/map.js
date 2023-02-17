import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapbox, { Source, Layer, GeolocateControl } from 'react-map-gl';
import { useTheme } from '../hooks/theme';
import { useQuery } from '../hooks/query';
import styles from '../mapbox-style.json';

export const Map = forwardRef((props, ref) => {
    const { flyCoords, onCameraUpdate } = props;
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { agency } = useParams();
    
    const map = useRef();
    const geolocateControl = useRef();
    
    const bounds = useQuery({
        method: 'post',
        url: '/api/map-bounds',
        ...(agency && { data: { agency } })
    })?.data.bounds;
    
    useImperativeHandle(ref, () => ({
        triggerGeolocation: () => geolocateControl.current?.trigger()
    }));
    
    useEffect(() => {
        if (!bounds) { return; }
        onCameraUpdate({
            viewState: {
                longitude: (bounds[0] + bounds[2]) / 2,
                latitude: (bounds[1] + bounds[3]) / 2
            }
        });
    }, [ bounds, onCameraUpdate ]);
    
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
    
    MapboxGL.workerClass = MapboxWorker;
    
    const accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN;
    const mapStyle = theme === "light-mode" ?
        process.env.REACT_APP_MAPBOX_LIGHT_STYLE_URL :
        process.env.REACT_APP_MAPBOX_DARK_STYLE_URL;
        
    if (!theme || !bounds) { return null; }
    
    return pug`
        #map-container
            Mapbox(
                ref=map
                mapLib=MapboxGL
                mapboxAccessToken=accessToken
                mapStyle=mapStyle
                bounds=bounds
                fitBoundsOptions={ padding: 72 }
                transformRequest=prefixHostname
                onMove=onCameraUpdate
                onClick=handleClick
                onMouseEnter=handleMouseEnter
                onMouseLeave=handleMouseLeave
                interactiveLayerIds=interactiveLayers
            )
                GeolocateControl(
                    ref=geolocateControl
                    trackUserLocation=true
                    showUserHeading=true
                    style={ display: 'none' }
                )
                Source(
                    id="internal-api"
                    type="vector"
                    tiles=['/api/map-tiles/{z}/{x}/{y}']
                    promoteId={'stops':'stop_id','routes':'route_id'}
                    minzoom=8
                    maxzoom=16
                )
                    each layer in styles[theme]
                        Layer(key=layer.id, ...layer)
    `;
});