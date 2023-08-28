import React from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { RouteIcon } from '@components/route-icon';
import { Icon } from '@components/icon';

export const RouteList = () => {
    const { routes } = useOutletContext();
    
    const navigate = useNavigate();
    
    const closeCard = () => navigate('/');
    
    if (!routes) { return; }
    
    return (
        <div className="sidebar-card">
            <div className="card-header">
                <h2 className="alt-header">Nearby routes</h2>
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
        </div>
    );
};

export default RouteList;