import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@hooks/query';
import { useAuth } from '@hooks/auth';
import { Review } from '@components/review';
import { Button } from '@components/button';

import '@assets/styles/components/profile.scss';

export const ProfilePage = () => {
    const { username } = useParams();
    
    const { data, size, setSize } = useInfiniteQuery(page => ({
        method: 'post',
        url: '/api/profile',
        data: { username, page: page + 1 }
    }));
    
    const details = data?.[data?.length - 1];
    const reviews = data?.map(page => page.reviews).flat();
    
    const { auth } = useAuth();
    
    const [ focusedIndex, setFocusedIndex ] = useState(-1);
    
    if (!details || !reviews) { return null; }
    
    const incrementPage = () => {
        setFocusedIndex(reviews.length);
        setSize(size + 1);
    };
    
    const reviewCount = `${new Intl.NumberFormat().format(details.count)} review${details.count > 1 ? 's' : ''}`;
    
    const moreReviewsAvailable = details.count > reviews.length;
    
    return (
        <main className="page-fullscreen">
            <Helmet>
                <title>{ username }</title>
            </Helmet>
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
                    { reviews.map((review, index) => (
                        <Review
                            ref={ index === focusedIndex ? i => i?.focus() : undefined }
                            review={ review }
                            key={ review.id }
                            showOptions={ (auth.username == username || auth.admin) }
                            allowEditing={ auth.admin }
                        />
                    )) }
                </div>
                { moreReviewsAvailable && (
                    <Button
                        onClick={ incrementPage }
                        className="button--filled button--primary"
                    >
                        Show more
                    </Button>
                ) }
            </div>
        </main>
    );
};

export default ProfilePage;