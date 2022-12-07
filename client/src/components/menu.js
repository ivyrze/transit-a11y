import React, { Children, isValidElement, cloneElement, useState, useRef, useEffect } from 'react';
import { Icon } from './icon';

export const Menu = ({ children }) => {
    const [ popupOpen, setPopupOpen ] = useState(false);
    
    const toggleButton = useRef();
    const togglePopup = () => setPopupOpen(!popupOpen);
    
    const recurseChildren = children => {
        return Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
                return child;
            }
            
            let injections = {};
            if (index === 0) {
                injections.ref = first => first?.focus();
            }
            
            if (child.type === "button") {
                injections.role = "menuitem";
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
        
    return pug`
        .menu-container
            button.button-rounded.menu-toggle(
                ref=toggleButton
                aria-expanded=popupOpen
                aria-haspopup="true"
                onClick=togglePopup
            )
                Icon(name= "ellipsis")
            if popupOpen
                .menu-popup(role="menu")
                    | ${recurseChildren(children)}
    `;
};