import React from 'react';
import { Menu as MenuParent, MenuButton, useMenuStore } from '@ariakit/react';
import { Icon } from './icon';

export const Menu = props => {
    const { children } = props;
    const iconName = props.iconName ?? "ellipsis";
    
    const menuStore = useMenuStore();
    
    return (
        <div className="menu-container">
            <MenuButton
                className="button-rounded menu-toggle"
                store={ menuStore }
            >
                <Icon name={ iconName } />
            </MenuButton>
            <MenuParent
                className="menu-popup"
                store={ menuStore }
            >
                { children }
            </MenuParent>
        </div>
    );
};