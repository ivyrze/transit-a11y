import React from 'react';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const ReviewFields = props => {
    const { reviewId, stopId, compactView, onCancel } = props;
    
    return pug`
        unless compactView
            fieldset
                legend What features are available at this stop?
                ul.feature-option-container
                    each feature in [ 'bench', 'shelter', 'display', 'heating' ]
                        li.feature-option(key=feature)
                            input(
                                id="feature-" + feature
                                type="checkbox"
                                name="features[" + feature + "]"
                            )
                            label(for="feature-" + feature)
                                Icon(name= feature)
                                = i18n.tagLabels[feature]
        fieldset
            unless compactView
                legend What's the accessibility state at this stop?
            select(name="accessibility")
                optgroup(label="Unknown state")
                    option(value="unknown") Unknown accessibility state
                optgroup(label="Likely accessible")
                    option(value="accessible") Usually free of access barriers
                optgroup(label="Temporarily inaccessible")
                    option(value="construction") Construction blocking bus lane or stop
                    option(value="other-temporary") Other – specify below
                optgroup(label="It's complicated")
                    option(value="parking") Street parking often blocking curb
                    option(value="limited-maneuverability") Limited maneuverability for some riders
                    option(value="poor-conditions") Poor conditions in surrounding areas
                    option(value="other-complicated") Other – specify below
                optgroup(label="Not accessible")
                    option(value="missing-landing") Missing landing pad for ramp deployment
                    option(value="insufficient-dimensions") Insufficient landing pad dimensions
                    option(value="insufficient-curb") Insufficient curb height to create shallow ramp angle
                    option(value="uneven-surface") Uneven surface for alighting or deploying
                    option(value="missing-paths") Missing pathways to any surrounding areas
                    option(value="obstacles") Unavoidable obstacles
                    option(value="other-inaccessible") Other – specify below
        fieldset
            unless compactView
                legend Any additional comments?
            textarea(name="comments" placeholder="Provide additional details about this stop’s accessibility that may be useful to other riders." rows="3")
        unless compactView
            fieldset
                legend Do you have any photos to include?
                input(type="file" name="attachments" accept="image/jpeg" multiple)
        fieldset.button-set
            button.button-filled.button-primary(type="submit") Submit
            button.button-filled.form-cancel(type="button" onClick=onCancel) Cancel
        if reviewId
            input(type="hidden" name="id" value=reviewId)
        else if stopId
            input(type="hidden" name="stop" value=stopId)
    `;
};