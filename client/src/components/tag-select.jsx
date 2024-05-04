import React from 'react';
import { FormInput, FormLabel } from '@ariakit/react';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';

import '@assets/styles/components/tag-select.scss';

export const TagSelect = () => {
    return (
        <ul className="tag-select">
            { [ 'bench', 'shelter', 'display', 'heating' ].map(feature => (
                <li className="tag-select__option" key={ feature }>
                    <FormInput
                        type="checkbox"
                        id={ "feature-" + feature }
                        name="features"
                        value={ feature }
                        aria-describedby={ "feature-" + feature + "-label" }
                    />
                    <FormLabel
                        id={ "feature-" + feature + "-label" }
                        htmlFor={ "feature-" + feature }
                    >
                        <Icon name={ feature } />
                        { i18n.tagLabels[feature] }
                    </FormLabel>
                </li>
            )) }
        </ul>
    );
};