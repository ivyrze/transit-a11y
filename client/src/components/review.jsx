import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import { MenuItem } from '@ariakit/react';
import { Menu } from './menu';
import { Link } from 'react-router-dom';
import { Icon } from './icon';
import { FormWrapper } from './form-wrapper';
import { ReviewFields } from './review-fields';
import { AccessibilityState } from './accessibility-state';
import { AttachmentViewer } from './attachment-viewer';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';
import { getStatePriority } from '../../../common/a11y-states';
import i18n from '../i18n-strings.json';

export const Review = props => {
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
        
        newDetails.accessibility?.sort((a, b) => {
            return getStatePriority(a) - getStatePriority(b);
        });
        newDetails.accessibility ??= [ 'unknown' ];
        
        setDetails({ ...details, ...newDetails });
        stopEditing();
    };
    
    if (deleted) { return null; }
    
    let defaultValues = structuredClone(details);
    delete defaultValues.id;
    
    return (
        <article className="review-single">
            <div className="review-header">
                { details.author ? (
                    <>
                        <img className="profile-picture"
                            src={ details.author.avatar }
                            alt="Profile picture"
                        />
                        <Link
                            to={ "/profile/" + details.author.username }
                            className="review-author link-minimal"
                        >
                            { details.author.username }
                        </Link>
                    </>
                ) : (
                    <Link
                        to={ "/stop/" + details.stop.id }
                        className="review-stop link-minimal"
                    >
                        { details.stop.name }
                    </Link>
                ) }
                <TimeAgo
                    className="review-timestamp"
                    date={ details.timestamp }
                    title=""
                />
                { showOptions && (
                    <Menu>
                        { allowEditing && (
                            <MenuItem render={
                                <button
                                    onClick={ startEditing }
                                    className="menu-item"
                                >
                                    <Icon name= "pencil" />
                                    Edit
                                </button>
                            } />
                        ) }
                        <MenuItem render={
                            <button
                                onClick={ handleDelete }
                                className="menu-item"
                            >
                                <Icon name="trash" />
                                Delete
                            </button>
                        } />
                    </Menu>
                ) }
            </div>
            { !editing ? (
                <>
                    { details.accessibility.map(accessibility => (
                        <AccessibilityState
                            className="review-accessibility-state"
                            state={ accessibility }
                            key={ accessibility }
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
};