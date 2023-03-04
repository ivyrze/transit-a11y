import React from 'react';
import { RouteIcon } from './route-icon';

export const SearchResults = props => {
    const { results, openStop } = props;
    
    return pug`
        each result in results
            li(key=result.id)
                button.search-result(
                    type="button"
                    onClick=() => openStop(result.id)
                )= result.name
                    each route, index in result.routes
                        RouteIcon(
                            key=index
                            number=route.number
                            color=route.color
                        )
    `;
}