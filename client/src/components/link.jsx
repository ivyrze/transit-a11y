import React, { forwardRef } from 'react';
import { Link as LinkChild, NavLink as NavLinkChild } from 'react-router-dom';

import '@assets/styles/components/link.scss';

export const Link = forwardRef((props, ref) => {
    const { currentAware = false, ...passthroughProps } = props;
    
    const ChildComponent = currentAware ? NavLinkChild : LinkChild;
    
    return (
        <ChildComponent
            ref={ ref }
            { ...passthroughProps }
        />
    );
});