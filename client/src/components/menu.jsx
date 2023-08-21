import React, { Children, Fragment, isValidElement, cloneElement, useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

export const Menu = props => {
    const { children } = props;
    const iconName = props.iconName ?? "ellipsis";
    
    const [ popupOpen, setPopupOpen ] = useState(false);
    
    const toggleButton = useRef();
    const togglePopup = () => setPopupOpen(!popupOpen);
    
    const recurseChildren = children => {
        return Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
                return child;
            } else if (child.type === Fragment) {
                return recurseChildren(child.props.children);
            }
            
            let injections = {};
            if (child.type === "div" && child.props?.className === "menu-group") {
                injections.role = "group";
                
                if (child.props?.children) {
                    injections.children = recurseChildren(child.props.children);
                }
            } else {
                injections.role = "menuitem";
                
                if (index === 0) {
                    injections.ref = first => first?.focus();
                }
            }
            
            return cloneElement(child, injections);
        });
    };
    
    useEffect(() => {
        const checkOutsideClick = event => {
            if (toggleButton.current && !toggleButton.current.contains(event.target)) {
                setPopupOpen(false);
            }
        };
        
        document.body.addEventListener("click", checkOutsideClick);
        
        return () => document.body.removeEventListener("click", checkOutsideClick);
    }, [ setPopupOpen, toggleButton ]);
        
    return (
        <div className="menu-container">
            <button className="button-rounded menu-toggle"
                ref={ toggleButton }
                aria-expanded={ popupOpen }
                aria-haspopup="true"
                onClick={ togglePopup }
            >
                <Icon name={ iconName } />
            </button>
            { popupOpen && (
                <div className="menu-popup" role="menu">
                    { recurseChildren(children) }
                </div>
            ) }
        </div>
    );
};