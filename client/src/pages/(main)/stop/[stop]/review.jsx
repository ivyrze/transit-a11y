import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImmutableQuery } from '@hooks/query';
import { FormWrapper } from '@components/form-wrapper';
import { FormInput } from '@ariakit/react';
import { FormSubmit } from '@components/form-submit';
import { AccessibilitySelect } from '@components/accessibility-select';
import { TagSelect } from '@components/tag-select';
import { CommentsInput } from '@components/comments-input';
import { AttachmentInput } from '@components/attachment-input';
import { Button } from '@components/button';
import { useMapStore } from '@hooks/store';
import { getStateGroup } from '@common/a11y-states';
import i18n from '@assets/i18n-strings.json';

export const ReviewForm = () => {
    const { stop } = useParams();
    
    const { data: details } = useImmutableQuery({
        method: 'post',
        url: '/api/stop-details',
        data: { id: stop }
    });
    
    const navigate = useNavigate();
    const overrideStopStyle = useMapStore(state => state.overrideStopStyle);
    
    const showStopCard = () => navigate('/stop/' + stop);
    const closeCard = () => navigate('/');
    
    const handleFormResponse = response => {
        if (response?.accessibility) {
            overrideStopStyle({ [stop]: getStateGroup(response.accessibility).style });
        }
        closeCard();
    };
    
    return (
        <main className="sidebar-card review-card">
            <div className="card__header">
                <h1>{ details.name }</h1>
            </div>
            <span className="subtitle">
                { i18n.stopSubheadings[details.agency.vehicle] }
            </span>
            <FormWrapper
                action="/api/submit-review"
                method="post"
                autoComplete="off"
                onResponse={ handleFormResponse }
            >
                <fieldset>
                    <legend>What features are available at this stop?</legend>
                    <TagSelect />
                </fieldset>
                <fieldset>
                    <legend>What's the accessibility state at this stop?</legend>
                    <AccessibilitySelect />
                </fieldset>
                <fieldset>
                    <legend>Any additional comments?</legend>
                    <CommentsInput />
                </fieldset>
                <fieldset>
                    <legend>Do you have any photos to include?</legend>
                    <AttachmentInput />
                </fieldset>
                <fieldset className="button-set">
                    <FormSubmit className="button--filled button--primary" />
                    <Button
                        className="button--filled"
                        type="button"
                        onClick={ showStopCard }
                    >
                        Cancel
                    </Button>
                </fieldset>
                <FormInput type="hidden" name="stop" value={ stop } />
            </FormWrapper>
        </main>
    );
};

export default ReviewForm;