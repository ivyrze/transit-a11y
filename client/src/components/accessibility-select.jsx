import React, { forwardRef } from 'react';
import { AccessibilityState } from './accessibility-state';
import { Select, SelectArrow, SelectPopover, SelectGroup, SelectGroupLabel, SelectItem, SelectItemCheck, useSelectStore } from '@ariakit/react';
import { accessibilityGroups, accessibilityStates } from '../../../common/a11y-states';

export const AccessibilitySelect = forwardRef(({
    value, setValue, defaultValue = [], onTouch, ...props
}, ref) => {
    const selectStore = useSelectStore({ value, setValue, defaultValue });
    const selectValue = selectStore.useState("value");
    
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
                    <SelectGroup className="menu-group" key={ group }>
                        <SelectGroupLabel className="menu-group-label">
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
                className="menu-item"
            >
                <AccessibilityState
                    state={ state }
                    showIcon={ false }
                />
                <SelectItemCheck className="icon icon-check" />
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
                <SelectArrow className="icon" />
            </Select>
            <SelectPopover
                store={ selectStore }
                className="menu-popup"
                onBlur={ onTouch }
                fitViewport={ true }
                sameWidth
            >
                { renderAccessibilityGroups() }
            </SelectPopover>
        </>
    );
});