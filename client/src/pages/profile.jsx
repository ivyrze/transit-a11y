import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '../hooks/query';
import { useAuth } from '../hooks/auth';
import { Review } from '../components/review';
import { Icon } from '../components/icon';

export const ProfilePage = props => {
    const { username } = useParams();
    
    const details = useQuery({
        method: 'post',
        url: '/api/profile',
        data: { username }
    })?.data;
    
    const { auth } = useAuth();
    
    if (!details) { return null; }
    
    return pug`
        .page-fullscreen
            Link.button-rounded.page-close(
                to="/"
                aria-label="Close"
            )
                Icon(name= "close")
            .user-profile
                img.profile-picture(
                    src=details.avatar
                    alt="Profile picture"
                )
                h1= username
                .subtitle
                    | ${details.reviews.length}
                    | ${(details.reviews.length === 1) ? 'review' : 'reviews'}
                .review-container
                    each review, index in details.reviews
                        Review(
                            review=review
                            key=index
                            showOptions=(auth.username == username || auth.admin)
                            allowEditing=auth.admin
                        )
    `;
};