import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { Icon } from './icon';
import { Menu } from './menu';
import { AttachmentViewer } from './attachment-viewer';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';
import i18n from '../i18n-strings.json';

export const Review = props => {
    const { review, showOptions } = props;
    
    const [ deleted, setDeleted ] = useState(false);
    const { setErrorStatus } = useErrorStatus();
    
    const state = i18n.accessibilityStates[review.accessibility];
    
    const handleDelete = async () => {
        await queryHelper({
            method: 'post',
            url: '/api/delete-review',
            data: { id: review.id }
        }, setErrorStatus);
        setDeleted(true);
    };
    
    if (deleted) { return null; }
    
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
                    Link(
                        to="/stop/" + review.stop.id
                    ).review-stop= review.stop.name
                TimeAgo.review-timestamp(
                    date=review.timestamp
                    title=""
                )
                if showOptions
                    Menu
                        button(onClick=handleDelete)
                            Icon(name= "trash")
                            | Delete
            .review-accessibility-state(
                className="state-" + state.style
            )
                Icon(name= state.style)
                = state.heading
            if review.comments
                p= review.comments
            if review.attachments
                AttachmentViewer(attachments=review.attachments)
    `;
};