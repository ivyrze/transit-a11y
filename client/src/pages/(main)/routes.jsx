import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMapStore } from '@hooks/store';
import { RouteIcon } from '@components/route-icon';
import { Icon } from '@components/icon';

export const RouteList = () => {
    const navigate = useNavigate();
    const [
        setShouldQueryRoutes,
        routes
    ] = useMapStore(state => [
        state.setShouldQueryRoutes,
        state.routeList
    ]);
    
    useEffect(() => {
        setShouldQueryRoutes(true);
        return () => setShouldQueryRoutes(false);
    }, []);
    
    const closeCard = () => navigate('/');
    
    if (!routes) { return; }
    
    return (
        <main className="sidebar-card">
            <div className="card-header">
                <h1 className="alt-header">Nearby routes</h1>
                <button className="button-rounded card-close"
                    aria-label="Close"
                    onClick={ closeCard }
                >
                    <Icon name="close" />
                </button>
            </div>
            <div className="route-list">
                { routes.map(route => (
                    <Link
                        className="button-filled"
                        key={ route.route_id }
                        to={ "/route/" + route.route_id }
                        style={{ backgroundColor: route.route_color }}
                    >
                        { route.route_long_name }
                        <RouteIcon
                            number={ route.route_short_name }
                            color={ route.route_color }
                            inverted={ true }
                        />
                        <Icon name="chevron" />
                    </Link>
                )) }
                { !routes.length && (
                    <p>There are no nearby routes.</p>
                ) }
            </div>
        </main>
    );
};

export default RouteList;