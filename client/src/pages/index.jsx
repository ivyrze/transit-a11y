import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, Outlet, useParams, useNavigate, useMatch } from 'react-router-dom';
import { Search } from '../components/search';
import { Map } from '../components/map';
import { Menu } from '../components/menu';
import { Icon } from '../components/icon';
import { useErrorStatus } from '../hooks/error';
import { useAuth } from '../hooks/auth';
import { queryHelper } from '../hooks/query';

import 'mapbox-gl/dist/mapbox-gl.css';

export const IndexPage = () => {
    const title = 'is the metro accessible?';
    
    const navigate = useNavigate();
    const { stop } = useParams();
    
    const { auth } = useAuth();
    const { setErrorStatus } = useErrorStatus();
    const [ stopDetails, setStopDetails ] = useState({});
    const [ flyCoords, setFlyCoords ] = useState();
    const map = useRef();
    const cameraCoords = useRef();
    const [ renderedRoutes, setRenderedRoutes ] = useState();
    const shouldQueryRoutes = Boolean(useMatch('/routes'));
    
    useEffect(() => {
        if (!stop) { setStopDetails({}); return; }
        
        const updateStopDetails = async () => {
            const response = await queryHelper({
                method: 'post',
                url: '/api/stop-details',
                data: { id: stop }
            }, setErrorStatus);
            setStopDetails({ id: stop, ...response.data });
            setFlyCoords([
                response.data.coordinates.longitude,
                response.data.coordinates.latitude
            ]);
        };
        updateStopDetails();
    }, [ stop, setErrorStatus ]);
    
    const handleCameraUpdate = useCallback(event => cameraCoords.current = event.viewState, []);
    const handleRouteListUpdate = useCallback(routes => setRenderedRoutes(routes), []);
    const handleGeolocationTrigger = useCallback(() => map.current?.triggerGeolocation(), []);
    
    const openAboutCard = () => navigate('/about');
    
    return (
        <>
            <div id="sidebar-container">
                <h1 className="title">
                    <button className="button-link" onClick={ openAboutCard }>
                        { title }
                    </button>
                </h1>
                <div id="main-menu">
                    <Menu iconName="menu">
                        <div className="menu-group">
                            <Link to="/routes">
                                <Icon name="route" />
                                Show nearby routes
                            </Link>
                        </div>
                        <div className="menu-group">
                            { auth && auth.username ? (
                                <>
                                    <Link to={ "/profile/" + auth.username }>
                                        <Icon name="user" />
                                        View profile
                                    </Link>
                                    <Link to="/account/logout">
                                        <Icon name="login" />
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <Link to="/account/login">
                                    <Icon name="login" />
                                    Login
                                </Link>
                            ) }
                        </div>
                    </Menu>
                </div>
                <Search
                    cameraCoords={ cameraCoords }
                    onGeolocationTriggered={ handleGeolocationTrigger }
                />
                <Outlet context={{ details: stopDetails, routes: renderedRoutes }} />
            </div>
            <Map
                ref={ map }
                flyCoords={ flyCoords }
                onCameraUpdate={ handleCameraUpdate }
                onRouteListUpdate={ handleRouteListUpdate }
                shouldQueryRoutes={ shouldQueryRoutes }
            />
        </>
    );
{ }; }