import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from '@components/link';
import { CardClose } from '@components/card-close';
import { RouteIcon } from '@components/route-icon';
import { Select } from '@components/select';
import { SelectItem, useSelectStore } from '@ariakit/react';
import { Icon } from '@components/icon';
import { useImmutableQuery } from '@hooks/query';

import '@assets/styles/components/route-list.scss';

export const RouteList = () => {
    const { data } = useImmutableQuery({
        method: 'get',
        url: '/api/route-list'
    });

    const defaultValue = data?.agencies.find(agency => {
        return agency.default === true;
    }).id;
    const renderSelectLabel = () => data?.agencies.find(agency => {
        return agency.id == selectValue;
    }).name;
    
    const selectStore = useSelectStore({ defaultValue });
    const selectValue = selectStore.useState("value");

    const routes = data?.routes.filter(route => {
        return route.id.startsWith(selectValue);
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
                <Select
                    store={ selectStore }
                    valueLabel={ renderSelectLabel }
                >
                    { data?.agencies.map(agency => (
                        <SelectItem
                            className="select__item"
                            key={ agency.id }
                            value={ agency.id }
                        >
                            { agency.name }
                        </SelectItem>
                    )) }
                </Select>
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