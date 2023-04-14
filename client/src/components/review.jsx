import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Icon } from './icon';
import { Menu } from './menu';
import { FormWrapper } from './form-wrapper';
import { ReviewFields } from './review-fields';
import { AttachmentViewer } from './attachment-viewer';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';
import i18n from '../i18n-strings.json';

export const Review = props => {
    const { review, showOptions } = props;
    
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
    
    return pug`
        article.review-single
            .review-header
                if details.author
                    img.profile-picture(
                        src=details.author.avatar
                        alt="Profile picture"
                    )
                    Link(
                        to="/profile/" + details.author.username
                    ).review-author= details.author.username
                else if details.stop
                    Link(
                        to="/stop/" + details.stop.id
                    ).review-stop= details.stop.name
                TimeAgo.review-timestamp(
                    date=details.timestamp
                    title=""
                )
                if showOptions
                    Menu
                        button(onClick=startEditing)
                            Icon(name= "pencil")
                            | Edit
                        button(onClick=handleDelete)
                            Icon(name= "trash")
                            | Delete
            unless editing
                .review-accessibility-state(
                    className="state-" + state.style
                )
                    Icon(name= state.style)
                    = state.heading
                if details.comments
                    p= details.comments
                if details.attachments
                    AttachmentViewer(attachments=details.attachments)
            else
                FormWrapper(
                    action="/api/edit-review"
                    method="post"
                    autoComplete="off"
                    initialValues=initialValues
                    onSubmit=handleFormSubmit
                    onResponse=stopEditing
                )
                    ReviewFields(
                        reviewId=details.id
                        compactView=true
                        onCancel=stopEditing
                    )
    `;
};