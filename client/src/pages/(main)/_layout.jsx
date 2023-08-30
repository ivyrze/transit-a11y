import React, { useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@components/header';
import { Search } from '@components/search';
import { Map } from '@components/map';

import 'mapbox-gl/dist/mapbox-gl.css';

export const IndexLayout = () => {
    const map = useRef();
    
    const handleGeolocationTrigger = useCallback(() => {
        return map.current?.triggerGeolocation()
    }, []);
    
    return (
        <>
            <div id="sidebar-container">
                <Header minimal>
                    <Search
                        onGeolocationTriggered={ handleGeolocationTrigger }
                    />
                </Header>
                <Outlet />
            </div>
            <Map ref={ map } />
        </>
    );
};

export default IndexLayout;