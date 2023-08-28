import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@hooks/query';
import { useAuth } from '@hooks/auth';
import { Review } from '@components/review';
import { Icon } from '@components/icon';

export const ProfilePage = props => {
    const { username } = useParams();
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/profile',
        data: { username }
    });
    
    const { auth } = useAuth();
    
    if (!details) { return null; }
    
    const reviewCount = `${new Intl.NumberFormat().format(details.reviews.length)} review${details.reviews.length > 1 ? 's' : ''}`;
    
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
                    { reviewCount }
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

export default ProfilePage;