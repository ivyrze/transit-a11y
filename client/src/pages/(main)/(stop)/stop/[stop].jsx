import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, Disclosure, DisclosureContent, useDisclosureStore } from '@ariakit/react';
import { Menu } from '@components/menu';
import { useQuery } from '@hooks/query';
import { useAuth } from '@hooks/auth';
import { AccessibilityState } from '@components/accessibility-state';
import { Review } from '@components/review';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';

export const StopDetails = () => {
    const { stop } = useParams();
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/stop-details',
        data: { id: stop }
    });
    
    const disclosureStore = useDisclosureStore();
    const disclosureState = disclosureStore.useState(state => state.open);
    const { auth, setAuthRedirect } = useAuth();
    const navigate = useNavigate();
    
    const gsvURL = 'https://www.google.com/maps/@?' +
        new URLSearchParams({
            api: 1,
            map_action: 'pano',
            viewpoint: [
                details.coordinates.latitude,
                details.coordinates.longitude
            ].join(',')
        });
        
    const switchToReviewForm = () => {
        if (Object.keys(auth).length) {
            navigate('/review/' + stop);
        } else {
            navigate('/account/login');
            setAuthRedirect('/review/' + stop);
        }
    };
    
    const closeCard = () => navigate('/');
    
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
        <main className="sidebar-card stop-details-card">
            <div className="card-header">
                <h1>{ details.name }</h1>
                <div className="card-actions">
                    <Menu>
                        <MenuItem render={
                            <a
                                href={ gsvURL }
                                target="_blank"
                                rel="noreferrer"
                                className="menu-item"
                            >
                                Open in Google Street View
                                <Icon name="link" />
                            </a>
                        } />
                    </Menu>
                    <button
                        className="button-rounded card-close"
                        aria-label="Close"
                        onClick={ closeCard }
                    >
                        <Icon name="close" />
                    </button>
                </div>
            </div>
            <span className="subtitle">
                { i18n.stopSubheadings[details.agency.vehicle] }
            </span>
            <ul className="stop-tags-container">
                <li>
                    <AccessibilityState
                        className="stop-accessibility-state"
                        state={ details.accessibility }
                        showHeading="group"
                    />
                </li>
                { details.tags.map(tag => (
                    <li className="stop-tag" key={ tag }>
                        <Icon name={ tag } />
                        { i18n.tagLabels[tag] }
                    </li>
                )) }
            </ul>
            <p className="stop-accessibility-info">
                { details.alert?.description ?? details.description ??
                    i18n.accessibilityStates[details.accessibility].description }
            </p>
            { details.reviews && (
                <div className="review-container">
                    { details.reviews.length > 0 ? (
                        <>
                            <Disclosure
                                className="review-drawer-toggle"
                                store={ disclosureStore }
                            >
                                { i18n.reviewsToggleStates[disclosureState ? 'hide' : 'show'] }
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
                    Source: <a target="_blank" href={ details.agency.url } rel="noreferrer" className="link-minimal">{ details.agency.name }</a>
                </span>
            ) }
        </main>
    );
};

export default StopDetails;