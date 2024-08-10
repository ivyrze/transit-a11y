import React from 'react';
import { Icon } from '@components/icon';

import '@assets/styles/components/info-notice.scss';

export const InfoNotice = props => {
    const { iconName = 'warning', children } = props;

    return (
        <p className="info-notice">
            <Icon name={ iconName } />
            { children }
        </p>
    )
};

export default InfoNotice;