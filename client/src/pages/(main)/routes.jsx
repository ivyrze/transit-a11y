import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useMapStore, shallow } from '@hooks/store';
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
    ], shallow);
    
    useEffect(() => {
        setShouldQueryRoutes(true);
        return () => setShouldQueryRoutes(false);
    }, []);
    
    const closeCard = () => navigate('/');
    
    return (
        <main className="sidebar-card">
            <Helmet>
                <title>Routes</title>
            </Helmet>
            <div className="card-header">
                <h1 className="alt-header">Nearby routes</h1>
                <div className="card-actions">
                    <button className="button-rounded card-close"
                        aria-label="Close"
                        onClick={ closeCard }
                    >
                        <Icon name="close" />
                    </button>
                </div>
            </div>
            <div className="route-list">
                { routes && routes.map(route => (
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
                { !routes?.length && (
                    <p>There are no nearby routes.</p>
                ) }
            </div>
        </main>
    );
};

export default RouteList;