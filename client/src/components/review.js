import React from 'react';
import TimeAgo from 'react-timeago';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const Review = props => {
    const { review } = props;
    
    const state = i18n.accessibilityStates[review.accessibility];
    
    return pug`
        article.review-single
            .review-header
                img.profile-picture(
                    src=review.author.avatar
                    alt="Profile picture"
                )
                span.review-author= review.author.username
                TimeAgo.review-timestamp(
                    date=review.timestamp
                    title=""
                )
            .review-accessibility-state(
                className="state-" + state.style
            )
                Icon(name= state.style)
                = state.heading
            if review.comments
                p= review.comments
    `;
};