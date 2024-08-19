import React, { useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { Header } from '@components/header';
import { Search } from '@components/search';
import { Map } from '@components/map';

import '@assets/styles/components/card-layout.scss';

export const IndexLayout = () => {
    const map = useRef();
    
    const handleGeolocationTrigger = useCallback(() => {
        return map.current?.triggerGeolocation()
    }, []);
    
    return (
        <>
            <Helmet>
                <body className="main-layout" />
            </Helmet>
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