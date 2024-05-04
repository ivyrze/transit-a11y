import React, { forwardRef } from 'react';
import { AccessibilityState } from '@components/accessibility-state';
import { FormInput, Select, SelectPopover, SelectGroup, SelectGroupLabel, SelectItem, SelectItemCheck, SelectProvider, useSelectStore, useFormContext } from '@ariakit/react';
import { accessibilityGroups, accessibilityStates } from '@common/a11y-states';
import { Icon } from '@components/icon';

import '@assets/styles/components/accessibility-select.scss';

export const AccessibilitySelect = forwardRef((props, ref) => {
    const { name = "accessibility" } = props;

    const formStore = useFormContext();
    const setValue = value => formStore.setValue(name, value);
    const onTouch = () => formStore.setFieldTouched(name, true);
    
    const renderSelect = props => {
        const selectStore = useSelectStore({
            value: props.value, setValue, defaultValue: []
        });
        const selectValue = selectStore.useState("value");
        const isOpened = selectStore.useState("open");

        return (
            <SelectProvider store={ selectStore }>
                <Select
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
                    className="menu"
                    onBlur={ onTouch }
                    fitViewport={ true }
                    sameWidth
                >
                    { renderAccessibilityGroups() }
                </SelectPopover>
            </SelectProvider>
        );
    };
    
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
            .filter(group => group !== 'unknown' && group !== 'auxiliary')
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
        <FormInput
            name={ name }
            render={ renderSelect }
        />
    );
});