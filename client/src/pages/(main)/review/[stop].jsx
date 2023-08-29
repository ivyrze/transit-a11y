import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImmutableQuery } from '@hooks/query';
import { FormWrapper } from '@components/form-wrapper';
import { ReviewFields } from '@components/review-fields';
import i18n from '@assets/i18n-strings.json';

export const ReviewForm = () => {
    const { stop } = useParams();
    
    const { data: details } = useImmutableQuery({
        method: 'post',
        url: '/api/stop-details',
        data: { id: stop }
    });
    
    const navigate = useNavigate();
    
    if (!details?.name) { return null; }
    
    const showStopCard = () => navigate('/stop/' + stop);
    const closeCard = () => navigate('/');
    
    const handleFormResponse = response => closeCard();
    
    return (
        <div className="sidebar-card review-card">
            <div className="card-header">
                <h2>{ details.name }</h2>
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
                <ReviewFields
                    stopId={ stop }
                    onCancel={ showStopCard }
                />
            </FormWrapper>
        </div>
    );
};

export default ReviewForm;