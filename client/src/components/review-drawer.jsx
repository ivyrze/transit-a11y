import React from "react";
import { Disclosure, DisclosureContent, DisclosureProvider, useDisclosureStore } from '@ariakit/react';
import { ContributeButton } from '@components/contribute-button';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';

import "@assets/styles/components/review-drawer.scss";

export const ReviewDrawer = props => {
    const { children } = props;

    const disclosureStore = useDisclosureStore();
    const disclosureState = disclosureStore.useState(state => state.open);

    if (!children?.length) {
        return <ContributeButton />;
    }

    return (
        <DisclosureProvider store={ disclosureStore }>
            <Disclosure className="review-drawer-toggle">
                { i18n.reviewsToggleStates[disclosureState ? 'hide' : 'show'] }
                <Icon
                    name={ disclosureState ? "chevron-up" : "chevron-down" }
                    className="icon--fixed-right"
                />
            </Disclosure>
            <DisclosureContent>
                { children }
                <ContributeButton />
            </DisclosureContent>
        </DisclosureProvider>
    );
};