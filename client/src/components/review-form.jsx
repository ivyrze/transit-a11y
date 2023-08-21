import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FormWrapper } from './form-wrapper';
import { ReviewFields } from './review-fields';
import i18n from '../i18n-strings.json';

export const ReviewForm = () => {
    const { details } = useOutletContext();
    const navigate = useNavigate();
    
    if (!details.name) { return null; }
    
    const showStopCard = () => navigate('/stop/' + details.id);
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
                    stopId={ details.id }
                    onCancel={ showStopCard }
                />
            </FormWrapper>
        </div>
    );
}