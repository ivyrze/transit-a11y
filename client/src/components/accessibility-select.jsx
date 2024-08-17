import React, { forwardRef } from 'react';
import { AccessibilityState } from '@components/accessibility-state';
import { FormInput, useFormContext, SelectGroup, SelectGroupLabel, SelectItem, SelectItemCheck, useSelectStore } from '@ariakit/react';
import { Select } from '@components/select';
import { accessibilityGroups, accessibilityStates } from '@common/a11y-states';
import { Icon } from '@components/icon';

export const AccessibilitySelect = forwardRef((props, ref) => {
    const { name = "accessibility" } = props;

    const formStore = useFormContext();
    const setValue = value => formStore.setValue(name, value);
    const onTouch = () => formStore.setFieldTouched(name, true);

    const selectStore = useSelectStore({
        setValue, defaultValue: []
    });
    
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
                
                if (!states.length) { return; }

                return (
                    <SelectGroup className="select__group" key={ group }>
                        <SelectGroupLabel className="select__group-label">
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
                className="select__item"
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
            render={
                <Select
                    store={ selectStore }
                    valueLabel={ renderSelectLabel }
                    setValue={ setValue }
                    onTouch={ onTouch }
                >
                    { renderAccessibilityGroups() }
                </Select>
            }
        />
    );
});