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
    
    return (
        <div className="page-fullscreen">
            <Link
                className="button-rounded page-close"
                to="/"
                aria-label="Close"
            >
                <Icon name= "close" />
            </Link>
            <div className="user-profile">
                <img
                    className="profile-picture"
                    src={ details.avatar }
                    alt="Profile picture"
                />
                <h1>{ username }</h1>
                <div className="subtitle">
                    { details.reviews.length }
                    { (details.reviews.length === 1) ? ' review' : ' reviews' }
                </div>
                <div className="review-container">
                    { details.reviews.map(review => (
                        <Review
                            review={ review }
                            key={ review.id }
                            showOptions={ (auth.username == username || auth.admin) }
                            allowEditing={ auth.admin }
                        />
                    )) }
                </div>
            </div>
        </div>
    );
};