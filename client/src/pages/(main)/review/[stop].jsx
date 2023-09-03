import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImmutableQuery } from '@hooks/query';
import { FormWrapper } from '@components/form-wrapper';
import { ReviewFields } from '@components/review-fields';
import { useMapStore } from '@hooks/store';
import { getStateGroup } from '@common/a11y-states';
import i18n from '@assets/i18n-strings.json';

export const ReviewForm = () => {
    const { stop } = useParams();
    
    const { data: details } = useImmutableQuery({
        method: 'post',
        url: '/api/stop-details',
        data: { id: stop }
    });
    
    const navigate = useNavigate();
    const [
        overrideStopStyle,
        setStopOpened
    ] = useMapStore(state => [
        state.overrideStopStyle,
        state.setStopOpened
    ]);
    
    useEffect(() => {
        setStopOpened({ [stop]: true });
        return () => setStopOpened({ [stop]: false });
    }, [ stop, setStopOpened ]);
    
    if (!details?.name) { return null; }
    
    const showStopCard = () => navigate('/stop/' + stop);
    const closeCard = () => navigate('/');
    
    const handleFormResponse = response => {
        if (response?.accessibility) {
            overrideStopStyle({ [stop]: getStateGroup(response.accessibility).style });
        }
        closeCard();
    };
    
    return (
        <main className="sidebar-card review-card">
            <div className="card-header">
                <h1>{ details.name }</h1>
            </div>
            <span className="subtitle">
                { i18n.stopSubheadings[details.agency.vehicle] }
            </span>
            <FormWrapper
                action="/api/submit-review"
                method="post"
                autoComplete="off"
                onResponse={ handleFormResponse }
            >
                <ReviewFields
                    stopId={ stop }
                    onCancel={ showStopCard }
                />
            </FormWrapper>
        </main>
    );
};

export default ReviewForm;