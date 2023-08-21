import React from "react";

export const RouteIcon = props => {
    const { number, color, inverted } = props;
    
    let classList = [ "route-icon" ];
    let styleProps = {};
    
    if (color.startsWith("#")) {
        inverted ?
            styleProps.color = color :
            styleProps.backgroundColor = color;
    } else {
        classList.push("route-" + color);
    }
    
    if (inverted) { classList.push("inverted"); }
    
    return (
        <span
            className={ classList.join(" ") }
            style={ styleProps }
        >
            { number }
        </span>
    );
};