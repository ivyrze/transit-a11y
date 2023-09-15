import React from 'react';
import { FormInput, FormLabel, useFormContext } from '@ariakit/react';
import { AccessibilitySelect } from '@components/accessibility-select';
import { FormSubmit } from '@components/form-submit';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import i18n from '@assets/i18n-strings.json';

import '@assets/styles/components/review-fields.scss';

export const ReviewFields = props => {
    const { reviewId, stopId, compactView, onCancel } = props;
    
    const formStore = useFormContext();
    
    return (
        <>
            { !compactView && (
                <fieldset>
                    <legend>What features are available at this stop?</legend>
                    <ul className="feature-option-container">
                        { [ 'bench', 'shelter', 'display', 'heating' ].map(feature => (
                            <li className="feature-option" key={ feature }>
                                <FormInput
                                    type="checkbox"
                                    name={ "features[" + feature + "]" }
                                />
                                <FormLabel name={ "features[" + feature + "]" }>
                                    <Icon name={ feature } />
                                    { i18n.tagLabels[feature] }
                                </FormLabel>
                            </li>
                        )) }
                    </ul>
                </fieldset>
            ) }
            <fieldset>
                { !compactView && (
                    <legend>What's the accessibility state at this stop?</legend>
                ) }
                <FormInput
                    name="accessibility"
                    render={
                        <AccessibilitySelect
                            setValue={ value => formStore.setValue("accessibility", value) }
                            onTouch={ () => formStore.setFieldTouched("accessibility", true) }
                        />
                    }
                />
            </fieldset>
            <fieldset>
                { !compactView && (
                    <legend>Any additional comments?</legend>
                ) }
                <FormInput
                    name="comments"
                    render={
                        <textarea
                            placeholder="Provide additional details about this stop’s accessibility that may be useful to other riders."
                            rows="3"
                        />
                    }
                />
            </fieldset>
            { !compactView && (
                <fieldset>
                    <legend>Do you have any photos to include?</legend>
                    <FormInput type="file" name="attachments" accept="image/jpeg" multiple />
                </fieldset>
            ) }
            <fieldset className="button-set">
                <FormSubmit className="button--filled button--primary" />
                <Button
                    className="button--filled form-cancel"
                    type="button"
                    onClick={ onCancel }
                >
                    Cancel
                </Button>
            </fieldset>
            { reviewId && (
                <FormInput type="hidden" name="id" value={ reviewId } />
            ) }
            { stopId && (
                <FormInput type="hidden" name="stop" value={ stopId } />
            ) }
        </>
    );
};