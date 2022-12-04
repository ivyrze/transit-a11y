import React from 'react';
import { FormWrapper } from './form-wrapper';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const ReviewForm = props => {
    const { details, changeCardPresentation } = props;
    
    if (!details.name) { return null; }
    
    const closeCard = () => changeCardPresentation({
        action: 'close', card: 'reviewForm'
    });
    
    const handleFormResponse = response => closeCard();
    
    return pug`
        .card-header
            h2= details.name
        span.subtitle= i18n.stopSubheadings[details.agency.vehicle]
        FormWrapper(
            action="/api/submit-review"
            method="post"
            autoComplete="off"
            onResponse=handleFormResponse
        )
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
                legend What's the accessibility state at this stop?
                select(name="accessibility")
                    optgroup(label="Likely accessible")
                        option(value="accessible") Usually free of access barriers
                    optgroup(label="Sometimes accessible")
                        option(value="parking") Street parking often blocking curb
                        option(value="other-sometimes") Other – specify below
                    optgroup(label="Temporarily inaccessible")
                        option(value="construction") Construction blocking bus lane or stop
                        option(value="obstacles-temporary") Unavoidable obstacles
                        option(value="other-temporary") Other – specify below
                    optgroup(label="It's complicated")
                        option(value="limited-maneuverability") Limited maneuverability for some riders
                        option(value="poor-conditions") Poor conditions in surrounding areas
                        option(value="other-complicated") Other – specify below
                    optgroup(label="Not accessible")
                        option(value="missing-landing") Missing landing pad for ramp deployment
                        option(value="uneven-surface") Uneven surface for alighting or deploying
                        option(value="lacks-curb") Lacks curb to create shallow ramp angle
                        option(value="obstacles-permanent") Unavoidable obstacles
                        option(value="other-inaccessible") Other – specify below
            fieldset
                legend Any additional comments?
                textarea(name="comments" placeholder="Provide additional details about this stop’s accessibility that may be useful to other riders." rows="3")
            fieldset.button-set
                button.button-filled.button-primary(type="submit") Submit
                button.button-filled.form-cancel(type="button" onClick=closeCard) Cancel
            input(type="hidden" name="stop" value=details.id)
    `;
}