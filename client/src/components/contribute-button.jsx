import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/auth";
import { Button } from "@components/button";
import { Icon } from "@components/icon";

export const ContributeButton = () => {
    const { auth, setAuthRedirect } = useAuth();
    const navigate = useNavigate();

    const switchToReviewForm = () => {
        if (Object.keys(auth).length) {
            navigate('./review');
        } else {
            navigate('/account/login');
            setAuthRedirect('./review');
        }
    };

    return (
        <Button
            className="review-contribute"
            onClick={ switchToReviewForm }
        >
            <Icon name="add" />
            Contribute a review
        </Button>
    );
};