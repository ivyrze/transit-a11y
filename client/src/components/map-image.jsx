import React, { useRef, useCallback, useEffect } from 'react';
import { useMap } from 'react-map-gl';

export const MapImage = props => {
    const { name, src } = props;
    const { current: map } = useMap();
    
    const image = useRef();
    
    const addImage = useCallback(() => {
        if (!image.current) { return; }
        if (!map.hasImage(name)) {
            map.addImage(name, image.current);
        }
    }, [ map, name ]);
    
    useEffect(() => {
        map.loadImage(src, (error, result) => {
            if (error) { throw error; }
            image.current = result;
            addImage();
        });
    }, [ src, addImage ]);
    
    useEffect(() => {
        map.on("styledata", addImage);
        return () => map.off("styledata", addImage);
    }, [ map, addImage ]);
    
    return null;
};