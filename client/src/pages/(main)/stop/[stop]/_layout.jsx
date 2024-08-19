import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useImmutableQuery } from '@hooks/query';
import { useMapStore, usePerspectiveStore, shallow } from '@hooks/store';

export const StopLayout = () => {
    const { stop } = useParams();

    const perspective = usePerspectiveStore(state => state.perspective);
    
    const { data: details } = useImmutableQuery({
        method: 'post',
        url: '/api/stop-details',
        data: {
            id: stop,
            perspective
        }
    });
    
    const [
        flyTo,
        setStopOpened
    ] = useMapStore(state => [
        state.flyTo,
        state.setStopOpened
    ], shallow);
    
    useEffect(() => {
        setStopOpened({ [stop]: true });
        return () => setStopOpened({ [stop]: false });
    }, [ stop, setStopOpened ]);
    
    useEffect(() => {
        if (!details?.coordinates) { return; }
        
        flyTo([
            details.coordinates.longitude,
            details.coordinates.latitude
        ]);
    }, [ details?.coordinates, flyTo ]);
    
    return (
        <>
            <Helmet>
                <title>{ details.name }</title>
            </Helmet>
            <Outlet />
        </>
    );
};

export default StopLayout;