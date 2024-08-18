import React from 'react';
import { Helmet } from 'react-helmet';
import { CardClose } from '@components/card-close';
import { RadioProvider, RadioGroup } from '@ariakit/react';
import { BigRadio } from '@components/big-radio';
import { usePerspectiveStore } from '@hooks/store';

import '@assets/styles/components/perspective-switcher.scss';

export const PerspectiveSwitcher = () => {
    const [
        perspective,
        setPerspective
    ] = usePerspectiveStore(state => [
        state.perspective,
        state.setPerspective
    ]);

    const onChange = event => setPerspective(event.target.value);

    return (
        <main className="sidebar-card">
            <Helmet>
                <title>Perspectives</title>
            </Helmet>
            <div className="card__header">
                <h1 className="card__alt-heading">Switch perspectives</h1>
                <div className="card__actions">
                    <CardClose />
                </div>
            </div>
            <div className="perspective-switcher">
                <RadioProvider>
                    <RadioGroup>
                        <BigRadio
                            value="reviews"
                            checked={ perspective == "reviews" }
                            onChange={ onChange }
                            label="User reviews"
                            description="Data uploaded directly to the site by fellow users"
                            />
                        <BigRadio
                            value="agency"
                            checked={ perspective == "agency" }
                            onChange={ onChange }
                            label="Transit agency"
                            description="Data published by the agency through a public dataset"
                        />
                    </RadioGroup>
                </RadioProvider>
            </div>
        </main>
    );
};

export default PerspectiveSwitcher;