import React from 'react';
import { RouteIcon } from './route-icon';

export const SearchResults = props => {
    const { results, openStop } = props;
    
    return results.map(result => (
        <li key={ result.id }>
            <button
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
            </button>
        </li>
    ));
}