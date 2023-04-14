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
    
    return pug`
        .sidebar-card.review-card
            .card-header
                h2= details.name
            span.subtitle= i18n.stopSubheadings[details.agency.vehicle]
            FormWrapper(
                action="/api/submit-review"
                method="post"
                autoComplete="off"
                onResponse=handleFormResponse
            )
                ReviewFields(
                    stopId=details.id
                    onCancel=showStopCard
                )
    `;
}