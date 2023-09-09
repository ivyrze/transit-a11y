import React, { forwardRef } from 'react';

import '@assets/styles/components/button.scss';

export const Button = forwardRef((props, ref) => {
    return (
        <button
            ref={ ref }
            { ...props }
        />
    );
});