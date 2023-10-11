import React, { forwardRef, useState } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from '@components/link';
import { Icon } from '@components/icon';
import { AuthorLink } from '@components/author-link';
import { AccessibilityState } from '@components/accessibility-state';
import { AttachmentViewer } from '@components/attachment-viewer';

import '@assets/styles/components/review.scss';

export const Review = forwardRef((props, ref) => {
    const { review } = props;
    
    return (
        <article className="review">
            <div className="review__header">
                { review.author ? (
                    <AuthorLink author={ review.author } />
                ) : (
                    <Link
                        to={ "/stop/" + review.stop.id }
                        className="review__stop link--minimal"
                        ref={ ref }
                    >
                        { review.stop.name }
                    </Link>
                ) }
                <div className="review__actions">
                    { review.archived && (
                        <Icon name="archived" title="Archived review" />
                    ) }
                    <Link
                        to={ "/review/" + review.id }
                        className="link--minimal"
                    >
                        <TimeAgo
                            className="review__timestamp"
                            date={ review.timestamp }
                            title=""
                        />
                    </Link>
                </div>
            </div>
            { review.accessibility.map(accessibility => (
                <AccessibilityState
                    className="accessibility-state"
                    state={ accessibility }
                    key={ accessibility }
                    archived={ review.archived }
                />
            )) }
            { review.comments && (
                <p>{ review.comments }</p>
            ) }
            { review.attachments && (
                <AttachmentViewer attachments={ review.attachments } />
            ) }
        </article>
    );
});