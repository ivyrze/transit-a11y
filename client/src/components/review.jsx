import React, { forwardRef, useState } from 'react';
import TimeAgo from 'react-timeago';
import { MenuItem } from '@ariakit/react';
import { Menu } from '@components/menu';
import { Link } from '@components/link';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { FormWrapper } from '@components/form-wrapper';
import { ReviewFields } from '@components/review-fields';
import { AccessibilityState } from '@components/accessibility-state';
import { AttachmentViewer } from '@components/attachment-viewer';
import { useErrorStatus } from '@hooks/error';
import { queryHelper } from '@hooks/query';
import { statePrioritySort } from '@common/utils';

import '@assets/styles/components/review.scss';

export const Review = forwardRef((props, ref) => {
    const { review, showOptions, allowEditing } = props;
    
    const [ details, setDetails ] = useState(review);
    const [ editing, setEditing ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    const { setErrorStatus } = useErrorStatus();
    
    const handleDelete = async () => {
        await queryHelper({
            method: 'post',
            url: '/api/delete-review',
            data: { id: details.id }
        }, setErrorStatus);
        setDeleted(true);
    };
    
    const startEditing = () => setEditing(true);
    const stopEditing = () => setEditing(false);
    
    const handleFormSubmit = data => {
        const newDetails = Object.fromEntries(
            Array.from(data.keys())
            .map(key => [
                key, key === 'accessibility' ? 
                    data.getAll(key) : data.get(key)
            ]
        ));
        
        newDetails.accessibility?.sort(statePrioritySort);
        newDetails.accessibility ??= [ 'unknown' ];
        
        setDetails({ ...details, ...newDetails });
        stopEditing();
    };
    
    if (deleted) { return null; }
    
    let defaultValues = structuredClone(details);
    delete defaultValues.id;
    
    return (
        <article className="review">
            <div className="review__header">
                { details.author ? (
                    <>
                        <img className="profile-picture"
                            src={ details.author.avatar }
                            alt="Profile picture"
                        />
                        <Link
                            to={ "/profile/" + details.author.username }
                            className="review__author link--minimal"
                        >
                            { details.author.username }
                        </Link>
                    </>
                ) : (
                    <Link
                        to={ "/stop/" + details.stop.id }
                        className="review__stop link--minimal"
                        ref={ ref }
                    >
                        { details.stop.name }
                    </Link>
                ) }
                <div className="review__actions">
                    { review.archived && (
                        <Icon name="archived" title="Archived review" />
                    ) }
                    <TimeAgo
                        className="review__timestamp"
                        date={ details.timestamp }
                        title=""
                    />
                    { showOptions && (
                        <Menu>
                            { allowEditing && (
                                <MenuItem render={
                                    <Button
                                        onClick={ startEditing }
                                        className="menu__item"
                                    >
                                        <Icon name= "pencil" />
                                        Edit
                                    </Button>
                                } />
                            ) }
                            <MenuItem render={
                                <Button
                                    onClick={ handleDelete }
                                    className="menu__item"
                                >
                                    <Icon name="trash" />
                                    Delete
                                </Button>
                            } />
                        </Menu>
                    ) }
                </div>
            </div>
            { !editing ? (
                <>
                    { details.accessibility.map(accessibility => (
                        <AccessibilityState
                            className="review__accessibility-state"
                            state={ accessibility }
                            key={ accessibility }
                            archived={ review.archived }
                        />
                    )) }
                    { details.comments && (
                        <p>{ details.comments }</p>
                    ) }
                    { details.attachments && (
                        <AttachmentViewer attachments={ details.attachments } />
                    ) }
                </>
            ) : (
                <FormWrapper
                    action="/api/edit-review"
                    method="post"
                    autoComplete="off"
                    defaultValues={ defaultValues }
                    onSubmit={ handleFormSubmit }
                    onResponse={ stopEditing }
                >
                    <ReviewFields
                        reviewId={ details.id }
                        compactView={ true }
                        onCancel={ stopEditing }
                    />
                </FormWrapper>
            ) }
        </article>
    );
});