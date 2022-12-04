import React from 'react';

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
                        if route.color.startsWith("#")
                            span.route-icon(
                                aria-label=route.name
                                style={backgroundColor: route.color}
                                key=index
                            )= route.number
                        else
                            span.route-icon(
                                aria-label=route.name
                                className="route-" + route.color
                                key=index
                            )= route.number
    `;
}