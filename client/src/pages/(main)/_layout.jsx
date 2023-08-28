import React, { useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Search } from '@components/search';
import { Map } from '@components/map';
import { MainMenu } from '@components/main-menu';

import 'mapbox-gl/dist/mapbox-gl.css';

export const IndexPage = () => {
    const title = 'is the metro accessible?';
    
    const map = useRef();
    
    const handleGeolocationTrigger = useCallback(() => {
        return map.current?.triggerGeolocation()
    }, []);
    
    return (
        <>
            <div id="sidebar-container">
                <h1 className="title">
                    { title }
                </h1>
                <MainMenu />
                <Search
                    onGeolocationTriggered={ handleGeolocationTrigger }
                />
                <Outlet />
            </div>
            <Map ref={ map } />
        </>
    );
};

export default IndexPage;