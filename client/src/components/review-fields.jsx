import React from 'react';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const ReviewFields = props => {
    const { reviewId, stopId, compactView, onCancel } = props;
    
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
                <select name="accessibility">
                    <optgroup label="Unknown state">
                        <option value="unknown">Unknown accessibility state</option>
                    </optgroup>
                    <optgroup label="Likely accessible">
                        <option value="accessible">Usually free of access barriers</option>
                    </optgroup>
                    <optgroup label="Temporarily inaccessible">
                        <option value="construction">Construction blocking bus lane or stop</option>
                        <option value="other-temporary">Other – specify below</option>
                    </optgroup>
                    <optgroup label="It's complicated">
                        <option value="parking">Street parking often blocking curb</option>
                        <option value="limited-maneuverability">Limited maneuverability for some riders</option>
                        <option value="poor-conditions">Poor conditions in surrounding areas</option>
                        <option value="other-complicated">Other – specify below</option>
                    </optgroup>
                    <optgroup label="Not accessible">
                        <option value="missing-landing">Missing landing pad for ramp deployment</option>
                        <option value="insufficient-dimensions">Insufficient landing pad dimensions</option>
                        <option value="insufficient-curb">Insufficient curb height to create shallow ramp angle</option>
                        <option value="uneven-surface">Uneven surface for alighting or deploying</option>
                        <option value="missing-paths">Missing pathways to any surrounding areas</option>
                        <option value="obstacles">Unavoidable obstacles</option>
                        <option value="other-inaccessible">Other – specify below</option>
                    </optgroup>
                </select>
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