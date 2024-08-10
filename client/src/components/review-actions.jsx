import React from "react";
import { Menu } from "@components/menu";
import { MenuItem } from "@ariakit/react";
import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { useAuth } from "@hooks/auth";
import { useErrorStatus } from "@hooks/error";
import { queryHelper } from "@hooks/query";

export const ReviewActions = props => {
    const { review, onEdit, onDelete, onArchive } = props;

    const { auth } = useAuth();
    const { setErrorStatus } = useErrorStatus();

    const handleDelete = async () => {
        await queryHelper({
            method: 'post',
            url: '/api/delete-review',
            data: { id: review.id }
        }, setErrorStatus);
        onDelete();
    };

    const handleArchive = async () => {
        await queryHelper({
            method: 'post',
            url: '/api/archive-review',
            data: { id: review.id }
        }, setErrorStatus);
        onArchive();
    };

    if (auth.username != review.author.username && auth.role != 'ADMIN') { return null; }

    return (
        <Menu>
            { auth.role == 'ADMIN' && (
                <MenuItem render={
                    <Button
                        onClick={ onEdit }
                        className="menu__item"
                    >
                        <Icon name= "pencil" />
                        Edit
                    </Button>
                } />
            ) }
            <MenuItem render={
                <Button
                    onClick={ handleArchive }
                    className="menu__item"
                >
                    <Icon name="archive" />
                    { !review.archived ?
                        "Archive" :
                        "Unarchive"
                    }
                </Button>
            } />
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
    );
};