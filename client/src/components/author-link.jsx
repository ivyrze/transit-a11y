import React from "react";
import { Link } from "@components/link";

import "@assets/styles/components/author-link.scss";

export const AuthorLink = props => {
    const { author } = props;

    return (
        <div className="author-link">
            <img className="profile-picture"
                src={ author.avatar }
                alt="Profile picture"
            />
            <Link
                to={ "/profile/" + author.username }
                className="review__author link--minimal"
            >
                { author.username }
            </Link>
        </div>
    );
};