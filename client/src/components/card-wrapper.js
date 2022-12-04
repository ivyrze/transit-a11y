import React, { cloneElement } from 'react';

export const CardWrapper = props => {
    const { styleName, isOpen, changeCardPresentation, children } = props;
    
    if (!isOpen) { return null; }
    
    return pug`
        .sidebar-card(
            className=styleName + "-card"
        )
            | ${cloneElement(children, { changeCardPresentation })}
    `;
};