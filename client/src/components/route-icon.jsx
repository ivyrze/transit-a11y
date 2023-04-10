import React from "react";

export const RouteIcon = props => {
    const { number, color, inverted } = props;
    
    return pug`
        if !inverted
            if color.startsWith("#")
                span.route-icon(
                    style={backgroundColor: color}
                )= number
            else
                span.route-icon(
                    className="route-" + color
                )= number
        else
            if color.startsWith("#")
                span.route-icon.inverted(
                    style={color: color}
                )= number
            else
                span.route-icon.inverted(
                    className="route-" + color
                )= number
    `;
};