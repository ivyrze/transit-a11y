import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const AccessibilityState = props => {
    const { state, className, showHeading = true, showIcon = true } = props;
    
    const stateStrings = findAccessibilityStrings(state);
    const stateGroupStrings = findAccessibilityGroupStrings(state);
    
    return (
        <div { ...className && { className:
            className + " state-" + stateGroupStrings.style
        } }>
            { showIcon && (
                <Icon
                    name={ stateGroupStrings.style }
                    { ...showIcon === 'alt' && { alt: true } }
                />
            ) }
            { showHeading && (
                showHeading === 'group' ?
                stateGroupStrings.heading :
                stateStrings.heading
            ) }
        </div>
    );
};

export const findAccessibilityStrings = name => {
    return i18n.accessibilityStates.find(state => state.name === name);
};

export const findAccessibilityGroupStrings = name => {
    const groupName = findAccessibilityStrings(name).group;
    return i18n.accessibilityGroups.find(group => group.name === groupName);
};