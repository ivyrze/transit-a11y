import React from 'react';
import { Radio } from '@ariakit/react';

import '@assets/styles/components/big-radio.scss';

export const BigRadio = props => {
    const { label, description, ...passthroughProps } = props;

    return (
        <label className="big-radio">
            <Radio { ...passthroughProps } />
            <div>
                <div className="big-radio__label">
                    { label }
                </div>
                <div className="big-radio__description">
                    { description }
                </div>
            </div>
        </label>
    );
};

export default BigRadio;