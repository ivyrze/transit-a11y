import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useQuery } from "@hooks/query";
import { AuthorLink } from "@components/author-link";
import { ReviewActions } from "@components/review-actions";
import { FormWrapper } from "@components/form-wrapper";
import { AttachmentViewer } from "@components/attachment-viewer";
import { AccessibilityState } from "@components/accessibility-state";
import { AccessibilitySelect } from "@components/accessibility-select";
import { CommentsInput } from "@components/comments-input";
import { TagList } from "@components/tag-list";
import { FormInput } from "@ariakit/react";
import { FormSubmit } from "@components/form-submit";
import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { statePrioritySort } from '@common/utils';

import "@assets/styles/components/review-details.scss";

export const ReviewDetails = () => {
    const { review } = useParams();

    const [ editing, setEditing ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);

    const { data: details, mutate } = useQuery({
        method: 'post',
        url: '/api/review-details',
        data: { id: review }
    });

    const timestampFormatted = new Intl.DateTimeFormat(false, {
        dateStyle: 'full', timeStyle: 'short'
    }).format(new Date(details.timestamp));

    const handleDelete = () => {
        setDeleted(true);
        setEditing(false);
    };

    const handleArchive = () => {
        mutate({ ...details, archived: !details.archived });
    };

    const handleEdit = (response, data) => {
        const newDetails = Object.fromEntries(
            Array.from(data.keys())
            .map(key => [
                key, key === 'accessibility' ? 
                    data.getAll(key) : data.get(key)
            ]
        ));

        newDetails.accessibility?.sort(statePrioritySort);
        newDetails.accessibility ??= [ 'unknown' ];
        
        setEditing(false);
        mutate({ ...details, ...newDetails });
    };

    let defaultValues = structuredClone(details);
    delete defaultValues.id;

    const fallbackValue = (
        <p className="review-details__fallback">None provided.</p>
    );

    return (
        <main className="page-fullscreen">
            <Helmet>
                <title>{ details.stop.name }</title>
            </Helmet>
            <FormWrapper
                className="review-details"
                action="/api/edit-review"
                method="post"
                autoComplete="off"
                defaultValues={ defaultValues }
                onResponse={ handleEdit }
            >
                <div className="review-details__header">
                    <h1>
                        { deleted ? (
                            <del>{ details.stop.name }</del>
                        ) : (
                            details.stop.name
                        ) }
                    </h1>
                    { !deleted && (
                        <ReviewActions
                            review={ details }
                            onEdit={ () => setEditing(true) }
                            onDelete={ handleDelete }
                            onArchive={ handleArchive }
                        />
                    ) }
                </div>
                <div className="review-details__author">
                    <span className="subtitle">Review by </span>
                    <AuthorLink author={ details.author } />
                </div>
                <div className="review-details__field">
                    <h2>Timestamp</h2>
                    <p className="review-details__timestamp">
                        <time dateTime={ details.timestamp }>
                            { timestampFormatted }
                        </time>
                        { details.archived && (
                            <Icon name="archived" title="Archived review" />
                        ) }
                    </p>
                </div>
                <div className="review-details__field">
                    <h2>Accessibility state</h2>
                    { editing ? (
                        <AccessibilitySelect />
                    ) : details.accessibility.map(accessibility => (
                        <AccessibilityState
                            className="accessibility-state"
                            state={ accessibility }
                            key={ accessibility }
                        />
                    )) }
                </div>
                <div className="review-details__field">
                    <h2>Feature tags</h2>
                    { details.tags?.length ? (
                        <TagList tags={ details.tags } />
                    ) : (
                        fallbackValue
                    ) }
                </div>
                <div className="review-details__field">
                    <h2>Comments</h2>
                    { editing ? (
                        <CommentsInput />
                    ) : details.comments ? (
                        <p>{ details.comments }</p>
                    ) : (
                        fallbackValue
                    ) }
                </div>
                <div className="review-details__field">
                    <h2>Attachments</h2>
                    { details.attachments?.length ? (
                        <AttachmentViewer attachments={ details.attachments } />
                    ) : (
                        fallbackValue
                    ) }
                </div>
                { editing && (
                    <FormInput type="hidden" name="id" value={ review } />
                ) }
                { editing && (
                    <div className="button-set">
                        <FormSubmit className="button--filled button--primary" />
                        <Button
                            className="button--filled"
                            type="button"
                            onClick={ () => setEditing(false) }
                        >
                            Cancel
                        </Button>
                    </div>
                ) }
            </FormWrapper>
        </main>
    );
};

export default ReviewDetails;