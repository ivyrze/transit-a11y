import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Disclosure, DisclosureContent, useDisclosureStore } from '@ariakit/react';
import { useAuth } from '../hooks/auth';
import { Review } from './review';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const StopDetails = () => {
    const { details } = useOutletContext();
    
    const disclosureStore = useDisclosureStore();
    const disclosureState = disclosureStore.useState();
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
    
    const ContributeButton = () => (
        <button
            className="review-contribute"
            onClick={ switchToReviewForm }
        >
            <Icon name="add" />
            Contribute a review
        </button>
    );
    
    return (
        <div className="sidebar-card stop-details-card">
            <div className="card-header">
                <h2>{ details.name }</h2>
                <button
                    className="button-rounded card-close"
                    aria-label="Close"
                    onClick={ closeCard }
                >
                    <Icon name="close" />
                </button>
            </div>
            <span className="subtitle">
                { i18n.stopSubheadings[details.agency.vehicle] }
            </span>
            <ul className="stop-tags-container">
                <li className={ "stop-accessibility-state state-" + state.style }>
                    <Icon name={ state.style } />
                    { state.tag }
                </li>
                { details.tags.map(tag => (
                    <li className="stop-tag" key={ tag }>
                        <Icon name={ tag } />
                        { i18n.tagLabels[tag] }
                    </li>
                )) }
            </ul>
            <p className="stop-accessibility-info">
                { details.alert?.description ?? details.description ?? state.description }
            </p>
            { details.reviews && (
                <div className="review-container">
                    { details.reviews.length > 0 ? (
                        <>
                            <Disclosure
                                className="review-drawer-toggle"
                                store={ disclosureStore }
                            >
                                { i18n.reviewsToggleStates[disclosureState.open ? 'hide' : 'show'] }
                                <Icon name="chevron" />
                            </Disclosure>
                            <DisclosureContent store={ disclosureStore }>
                                { details.reviews.map(review => (
                                    <Review
                                        review={ review }
                                        key={ review.id }
                                        showOptions={ false }
                                    />
                                )) }
                                <ContributeButton />
                            </DisclosureContent>
                        </>
                    ) : (
                        <ContributeButton />
                    ) }
                </div>
            ) }
            { details.alert && (
                <a
                    className="stop-alert-link link-external"
                    href={ details.alert.url }
                    target="_blank"
                >
                    View service alert details
                    <Icon name="link" />
                </a>
            ) }
            { (!details.alert && !details.reviews) && (
                <span className="source-link">
                    Source: <a target="_blank" href={ details.agency.url }>{ details.agency.name }</a>
                </span>
            ) }
        </div>
    );
};