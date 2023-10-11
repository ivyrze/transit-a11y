import React from 'react';
import { useParams } from 'react-router-dom';
import { MenuItem } from '@ariakit/react';
import { Menu } from '@components/menu';
import { useQuery } from '@hooks/query';
import { AccessibilityState } from '@components/accessibility-state';
import { Review } from '@components/review';
import { ReviewDrawer } from '@components/review-drawer';
import { CardClose } from '@components/card-close';
import { Link } from '@components/link';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';

import '@assets/styles/components/stop-details.scss';

export const StopDetails = () => {
    const { stop } = useParams();
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/stop-details',
        data: { id: stop }
    });
    
    const gsvURL = 'https://www.google.com/maps/@?' +
        new URLSearchParams({
            api: 1,
            map_action: 'pano',
            viewpoint: [
                details.coordinates.latitude,
                details.coordinates.longitude
            ].join(',')
        });
        
    return (
        <main className="sidebar-card stop-details-card">
            <div className="card__header">
                <h1>{ details.name }</h1>
                <div className="card__actions">
                    <Menu>
                        <MenuItem render={
                            <Link
                                to={ gsvURL }
                                target="_blank"
                                rel="noreferrer"
                                className="menu__item"
                            >
                                Open in Google Street View
                                <Icon name="link" />
                            </Link>
                        } />
                    </Menu>
                    <CardClose />
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
                { details.description ?? i18n.accessibilityStates[details.accessibility].description }
            </p>
            { details.reviews && (
                <div className="review-container">
                    <ReviewDrawer>
                        { details.reviews.map(review => (
                            <Review
                                review={ review }
                                key={ review.id }
                                showOptions={ false }
                            />
                        )) }
                    </ReviewDrawer>
                </div>
            ) }
        </main>
    );
};

export default StopDetails;