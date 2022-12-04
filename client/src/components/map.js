import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';
import Mapbox, { Source, Layer } from 'react-map-gl';
import { useTheme } from '../hooks/theme';
import { useQuery } from '../hooks/query';
import styles from '../mapbox-style.json';

export const Map = props => {
    const { flyCoords, onCameraUpdate, openStop } = props;
    const { theme } = useTheme();
    const { agency } = useParams();
    
    const map = useRef();
    
    const bounds = useQuery({
        method: 'post',
        url: '/api/map-bounds',
        ...(agency && { data: { agency } })
    })?.data.bounds;
    
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
            openStop(event.features[0].id);
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
                Source(
                    id="internal-api"
                    type="vector"
                    tiles=['/api/map-tiles/{z}/{x}/{y}']
                    promoteId={'stops':'stop_id','routes':'route_id'}
                    minZoom=8
                    maxZoom=22
                )
                    each layer in styles[theme]
                        Layer(key=layer.id, ...layer)
    `;
};