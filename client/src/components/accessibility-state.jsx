import React from 'react';
import cx from 'classnames';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';
import { accessibilityStates, accessibilityGroups } from '@common/a11y-states';

import '@assets/styles/components/accessibility-state.scss';

export const AccessibilityState = props => {
    const { state, className, showHeading = true, showIcon = true, archived = false } = props;
    
    const stateProps = accessibilityStates.get(state);
    const stateGroupProps = accessibilityGroups.get(stateProps.group);
    
    const stateStrings = i18n.accessibilityStates[state];
    const stateGroupStrings = i18n.accessibilityGroups[stateProps.group];
    
    const iconAccessibleTitle = stateGroupProps.style.charAt(0).toUpperCase() +
        stateGroupProps.style.slice(1) + " state";
    
    const componentInner = (
        <>
            { showIcon && (
                <Icon
                    name={ stateGroupProps.style }
                    { ...showIcon === 'alt' && { alt: true } }
                    { ...!showHeading && { title: iconAccessibleTitle } }
                />
            ) }
            { showHeading && (
                showHeading === 'group' ?
                stateGroupStrings :
                stateStrings.heading
            ) }
        </>
    );

    return (
        <div className={ cx(
            className,
            "state-" + stateGroupProps.style
        ) }>
            { !archived ? componentInner : <del>{ componentInner }</del> }
        </div>
    );
};