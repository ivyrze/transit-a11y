import React, { forwardRef } from 'react';
import { AccessibilityState } from '@components/accessibility-state';
import { Select, SelectPopover, SelectGroup, SelectGroupLabel, SelectItem, SelectItemCheck, useSelectStore } from '@ariakit/react';
import { accessibilityGroups, accessibilityStates } from '@common/a11y-states';
import { Icon } from '@components/icon';

import '@assets/styles/components/accessibility-select.scss';

export const AccessibilitySelect = forwardRef(({
    value, setValue, defaultValue = [], onTouch, ...props
}, ref) => {
    const selectStore = useSelectStore({ value, setValue, defaultValue });
    const selectValue = selectStore.useState("value");
    const isOpened = selectStore.useState("open");
    
    const renderSelectLabel = value => {
        if (value.length == 0) {
            return "Unknown accessibility state";
        } else if (value.length == 1) {
            return <AccessibilityState state={ value[0] } showIcon={ false } />
        } else {
            return value.length + " states selected";
        }
    };
    
    const renderAccessibilityGroups = () => {
        return [ ...accessibilityGroups.keys() ]
            .filter(group => group !== 'unknown')
            .map(group => {
                const states = [ ...accessibilityStates ]
                    .filter(state => state[1].group === group)
                    .filter(state => !state[1].unreviewable)
                    .map(state => state[0]);
                
                return (
                    <SelectGroup className="menu__group" key={ group }>
                        <SelectGroupLabel className="menu__group-label">
                            <AccessibilityState
                                state={ states[0] }
                                showHeading="group"
                                showIcon={ false }
                            />
                        </SelectGroupLabel>
                        { renderAccessibilityStates(states) }
                    </SelectGroup>
                );
            }
        );
    };
    
    const renderAccessibilityStates = states => {
        return states.map(state => (
            <SelectItem
                key={ state }
                value={ state }
                className="menu__item"
            >
                <AccessibilityState
                    state={ state }
                    showIcon={ false }
                />
                <SelectItemCheck render={ <></> }>
                    <Icon name="check" className="icon--fixed-right" />
                </SelectItemCheck>
            </SelectItem>
        ));
    };
    
    return (
        <>
            <Select
                store={ selectStore }
                ref={ ref }
                className="multi-select"
                onBlur={ onTouch }
                { ...props }
            >
                { renderSelectLabel(selectValue) }
                <Icon
                    name={ isOpened ? "chevron-up" : "chevron-down" }
                    className="icon--fixed-right"
                />
            </Select>
            <SelectPopover
                store={ selectStore }
                className="menu"
                onBlur={ onTouch }
                fitViewport={ true }
                sameWidth
            >
                { renderAccessibilityGroups() }
            </SelectPopover>
        </>
    );
});