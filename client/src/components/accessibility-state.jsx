import { Icon } from './icon';
import i18n from '../i18n-strings.json';
import { accessibilityStates, accessibilityGroups } from '../../../common/a11y-states';

export const AccessibilityState = props => {
    const { state, className, showHeading = true, showIcon = true } = props;
    
    const stateProps = accessibilityStates.get(state);
    const stateGroupProps = accessibilityGroups.get(stateProps.group);
    
    const stateStrings = i18n.accessibilityStates[state];
    const stateGroupStrings = i18n.accessibilityGroups[stateProps.group];
    
    return (
        <div { ...className && { className:
            className + " state-" + stateGroupProps.style
        } }>
            { showIcon && (
                <Icon
                    name={ stateGroupProps.style }
                    { ...showIcon === 'alt' && { alt: true } }
                />
            ) }
            { showHeading && (
                showHeading === 'group' ?
                stateGroupStrings :
                stateStrings.heading
            ) }
        </div>
    );
};