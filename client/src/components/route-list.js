import React from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { RouteIcon } from './route-icon';
import { Icon } from './icon';

export const RouteList = () => {
    const { routes } = useOutletContext();
    
    const navigate = useNavigate();
    
    const closeCard = () => navigate('/');
    
    if (!routes) { return; }
    
    return pug`
        .sidebar-card
            .card-header
                h2.alt-header Nearby routes
                button.button-rounded.card-close(
                    aria-label="Close"
                    onClick=closeCard
                )
                    Icon(name= "close")
            .route-list
                if routes.length
                    for route in routes
                        Link.button-filled(
                            key=route.route_id
                            to="/route/" + route.route_id
                            style={ backgroundColor: route.route_color }
                        )= route.route_long_name
                            RouteIcon(
                                number=route.route_short_name
                                color=route.route_color
                                inverted=true
                            )
                            Icon(name="chevron")
                else
                    p There are no nearby routes.
    `;
}