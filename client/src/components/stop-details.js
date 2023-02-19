import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { Review } from './review';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const StopDetails = () => {
    const { details } = useOutletContext();
    
    const [ expanded, setExpanded ] = useState(false);
    const { auth, setAuthRedirect } = useAuth();
    const navigate = useNavigate();
    
    if (!details.name) { return null; }
    
    const switchToReviewForm = () => {
        if (Object.keys(auth).length) {
            navigate('/review/' + details.id);
        } else {
            navigate('/account/login');
            setAuthRedirect('/review/' + details.id);
        }
    };
    
    const closeCard = () => navigate('/');
    
    const state = i18n.accessibilityStates[details.accessibility];
    
    return pug`
        .sidebar-card.stop-details-card
            .card-header
                h2= details.name
                button.button-rounded.card-close(
                    aria-label="Close"
                    onClick=closeCard
                )
                    Icon(name= "close")
            span.subtitle= i18n.stopSubheadings[details.agency.vehicle]
            ul.stop-tags-container
                li.stop-accessibility-state(
                    className="state-" + state.style
                )
                    Icon(name= state.style)
                    = state.tag
                each tag in details.tags
                    li.stop-tag(key=tag)
                        Icon(name= tag)
                        = i18n.tagLabels[tag]
            p.stop-accessibility-info
                | ${details.alert?.description ?? details.description ?? state.description}
            if details.reviews
                .review-container
                    if details.reviews.length
                        button.review-drawer-toggle(
                            aria-expanded=expanded
                            aria-controls="review-drawer"
                            onClick=() => setExpanded(!expanded)
                        )= i18n.reviewsToggleStates[expanded ? 'hide' : 'show']
                            Icon(name= "chevron")
                    if !details.reviews.length || expanded
                        #review-drawer
                            each review, index in details.reviews
                                Review(
                                    review=review
                                    key=index
                                    showOptions=false
                                )
                            button.review-contribute(
                                onClick=switchToReviewForm
                            )
                                Icon(name= "add")
                                | Contribute a review
            if details.alert
                a.stop-alert-link.link-external(
                    href=details.alert.url
                    target="_blank"
                )
                    | View service alert details
                    Icon(name= "link")
            if !details.alert && !details.reviews
                span.source-link
                    | Source: 
                    a(
                        target="_blank"
                        href=details.agency.url
                    )= details.agency.name
    `;
};