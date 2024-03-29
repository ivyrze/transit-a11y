import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '@components/link';
import { CardClose } from '@components/card-close';
import { RouteIcon } from '@components/route-icon';
import { Icon } from '@components/icon';
import { useImmutableQuery } from '@hooks/query';

import '@assets/styles/components/route-list.scss';

export const RouteList = () => {
    const { data: routes } = useImmutableQuery({
        method: 'get',
        url: '/api/route-list'
    });
    
    return (
        <main className="sidebar-card">
            <Helmet>
                <title>Routes</title>
            </Helmet>
            <div className="card__header">
                <h1 className="card__alt-heading">Route explorer</h1>
                <div className="card__actions">
                    <CardClose />
                </div>
            </div>
            <div className="route-list">
                { routes && routes.map(route => (
                    <Link
                        className="button--filled"
                        key={ route.id }
                        to={ "/route/" + route.id }
                        style={{ backgroundColor: route.color }}
                    >
                        { route.name }
                        <RouteIcon
                            number={ route.number }
                            color={ route.color }
                            inverted={ true }
                        />
                        <Icon name="chevron-right" className="icon--fixed-right" />
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