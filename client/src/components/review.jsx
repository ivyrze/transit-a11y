import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import { MenuItem } from '@ariakit/react';
import { Menu } from './menu';
import { Link } from 'react-router-dom';
import { Icon } from './icon';
import { FormWrapper } from './form-wrapper';
import { ReviewFields } from './review-fields';
import { AttachmentViewer } from './attachment-viewer';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';
import i18n from '../i18n-strings.json';

export const Review = props => {
    const { review, showOptions, allowEditing } = props;
    
    const [ details, setDetails ] = useState(review);
    const [ editing, setEditing ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    const { setErrorStatus } = useErrorStatus();
    
    const state = i18n.accessibilityStates[details.accessibility];
    
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
        let tempDetails = structuredClone(details);
        data.forEach((value, key) => tempDetails[key] = value);
        setDetails(tempDetails);
        stopEditing();
    };
    
    if (deleted) { return null; }
    
    let initialValues = structuredClone(details);
    delete initialValues.id;
    
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
                            className="review-author"
                        >
                            { details.author.username }
                        </Link>
                    </>
                ) : (
                    <Link
                        to={ "/stop/" + details.stop.id }
                        className="review-stop"
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
                                <button onClick={ startEditing }>
                                    <Icon name= "pencil" />
                                    Edit
                                </button>
                            } />
                        ) }
                        <MenuItem render={
                            <button onClick={ handleDelete }>
                                <Icon name="trash" />
                                Delete
                            </button>
                        } />
                    </Menu>
                ) }
            </div>
            { !editing ? (
                <>
                    <div className={ "review-accessibility-state state-" + state.style }>
                        <Icon name={ state.style } />
                        { state.heading }
                    </div>
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
                    initialValues={ initialValues }
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