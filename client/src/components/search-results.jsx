import React from 'react';
import { RouteIcon } from '@components/route-icon';
import { Button } from '@components/button';

import '@assets/styles/components/search-results.scss';

export const SearchResults = props => {
    const { results, openStop } = props;
    
    return results?.map(result => (
        <li key={ result.id }>
            <Button
                className="search-result"
                type="button"
                onClick={ () => openStop(result.id) }
            >
                { result.name }
                { result.routes.map((route, index) => (
                    <RouteIcon
                        key={ index }
                        number={ route.number }
                        color={ route.color }
                    />
                )) }
            </Button>
        </li>
    ));
}