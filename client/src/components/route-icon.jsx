import React from "react";
import cx from 'classnames';

import '@assets/styles/components/route-icon.scss';

export const RouteIcon = props => {
    const { number, color, inverted } = props;
    
    const isGenericColor = !color.startsWith("#");
    
    return (
        <div
            className={ cx(
                "route-icon",
                inverted && "inverted"
            ) }
            style={{
                [inverted ? 'color' : 'backgroundColor']: color
            }}
        >
            { number }
        </div>
    );
};