import React from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const Review = props => {
    const { review } = props;
    
    const state = i18n.accessibilityStates[review.accessibility];
    
    return pug`
        article.review-single
            .review-header
                if review.author
                    img.profile-picture(
                        src=review.author.avatar
                        alt="Profile picture"
                    )
                    Link(
                        to="/profile/" + review.author.username
                    ).review-author= review.author.username
                else if review.stop
                    span.review-stop= review.stop.name
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