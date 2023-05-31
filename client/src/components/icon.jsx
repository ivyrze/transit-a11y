import React from 'react';

export const Icon = props => {
    const { name, alt } = props;
    
    const altClass = alt ? " icon-alt" : "";
    
    return pug`
        span(
            className="icon icon-" + name + altClass
            aria-hidden="true"
        )
    `;
};