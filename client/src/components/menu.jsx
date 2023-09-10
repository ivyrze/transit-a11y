import React from 'react';
import { Menu as MenuParent, MenuButton, useMenuStore } from '@ariakit/react';
import { Icon } from '@components/icon';

import '@assets/styles/components/menu.scss';

export const Menu = props => {
    const { iconName = "ellipsis", toggleAriaLabel = "Toggle options menu", children } = props;
    
    const menuStore = useMenuStore();
    
    return (
        <>
            <MenuButton
                className="menu__toggle button--rounded"
                store={ menuStore }
                { ...toggleAriaLabel && { "aria-label": toggleAriaLabel } }
            >
                <Icon name={ iconName } />
            </MenuButton>
            <MenuParent
                className="menu"
                store={ menuStore }
            >
                { children }
            </MenuParent>
        </>
    );
};