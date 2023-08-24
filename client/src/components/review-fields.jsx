import React from 'react';
import { Select, SelectArrow, SelectPopover, SelectGroup, SelectGroupLabel, SelectItem, SelectItemCheck, useSelectStore } from '@ariakit/react';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';
import { AccessibilityState } from './accessibility-state';
import { accessibilityGroups, accessibilityStates } from '../../../common/a11y-states';

export const ReviewFields = props => {
    const { reviewId, stopId, compactView, onCancel } = props;
    
    const selectStore = useSelectStore({ defaultValue: [] });
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
    
    return (
        <>
            { !compactView && (
                <fieldset>
                    <legend>What features are available at this stop?</legend>
                    <ul className="feature-option-container">
                        { [ 'bench', 'shelter', 'display', 'heating' ].map(feature => (
                            <li className="feature-option" key={ feature }>
                                <input
                                    id={ "feature-" + feature }
                                    type="checkbox"
                                    name={ "features[" + feature + "]" }
                                />
                                <label htmlFor={ "feature-" + feature }>
                                    <Icon name={ feature } />
                                    { i18n.tagLabels[feature] }
                                </label>
                            </li>
                        )) }
                    </ul>
                </fieldset>
            ) }
            <fieldset>
                { !compactView && (
                    <legend>What's the accessibility state at this stop?</legend>
                ) }
                <Select name="accessibility" store={ selectStore } className="multi-select">
                    { renderSelectLabel(selectValue) }
                    <SelectArrow className="icon" />
                </Select>
                <SelectPopover
                    store={ selectStore }
                    className="menu-popup"
                    fitViewport={ true }
                    sameWidth
                >
                    { [ ...accessibilityGroups.keys() ]
                        .filter(group => group !== 'unknown')
                        .map(group => {
                            const groupItems = [ ...accessibilityStates ]
                                .filter(state => state[1].group === group)
                                .filter(state => !state[1].unreviewable)
                                .map(state => state[0]);
                            
                            return (
                                <SelectGroup className="menu-group">
                                    <SelectGroupLabel className="menu-group-label">
                                        <AccessibilityState
                                            state={ groupItems[0] }
                                            showHeading="group"
                                            showIcon={ false }
                                        />
                                    </SelectGroupLabel>
                                    { groupItems.map(state => (
                                        <SelectItem
                                            value={ state }
                                            className="menu-item"
                                        >
                                            <AccessibilityState
                                                state={ state }
                                                showIcon={ false }
                                            />
                                            <SelectItemCheck className="icon icon-check" />
                                        </SelectItem>
                                    )) }
                                </SelectGroup>
                            );
                        })
                    }
                </SelectPopover>
            </fieldset>
            <fieldset>
                { !compactView && (
                    <legend>Any additional comments?</legend>
                ) }
                <textarea
                    name="comments"
                    placeholder="Provide additional details about this stop’s accessibility that may be useful to other riders."
                    rows="3"
                />
            </fieldset>
            { !compactView && (
                <fieldset>
                    <legend>Do you have any photos to include?</legend>
                    <input type="file" name="attachments" accept="image/jpeg" multiple />
                </fieldset>
            ) }
            <fieldset className="button-set">
                <button
                    className="button-filled button-primary"
                    type="submit"
                >
                    Submit
                </button>
                <button
                    className="button-filled form-cancel"
                    type="button"
                    onClick={ onCancel }
                >
                    Cancel
                </button>
            </fieldset>
            { reviewId && (
                <input type="hidden" name="id" value={ reviewId } />
            ) }
            { stopId && (
                <input type="hidden" name="stop" value={ stopId } />
            ) }
        </>
    );
};