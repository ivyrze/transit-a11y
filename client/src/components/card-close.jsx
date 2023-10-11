import React from "react";
import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { useNavigate } from "react-router-dom";

export const CardClose = () => {
    const navigate = useNavigate();

    const closeCard = () => navigate('/');

    return (
        <Button
            className="button--rounded"
            aria-label="Close"
            onClick={ closeCard }
        >
            <Icon name="close" />
        </Button>
    );
};