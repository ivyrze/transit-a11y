import React from 'react';

export const Icon = props => {
    const { name } = props;
    
    return pug`
        span(
            className="icon icon-" + name
            aria-hidden="true"
        )
    `;
};