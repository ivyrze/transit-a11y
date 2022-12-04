import React, { useState, useRef, useReducer } from 'react';
import { Search } from '../components/search';
import { CardWrapper } from '../components/card-wrapper';
import { About } from '../components/about';
import { StopDetails } from '../components/stop-details';
import { ReviewForm } from '../components/review-form';
import { Map } from '../components/map';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';

import 'mapbox-gl/dist/mapbox-gl.css';

export const IndexPage = () => {
    const title = 'is the metro accessible?';
    
    const [ openedCards, changeCardPresentation ] =
        useReducer((state, { action, card }) => {
            for (const key in state) {
                state[key] = (action === 'open' && key === card);
            }
            return { ...state };
        }, {
            about: false, stopDetails: false, reviewForm: false
        });
    
    const { setErrorStatus } = useErrorStatus();
    const [ stopDetails, setStopDetails ] = useState({});
    const [ flyCoords, setFlyCoords ] = useState();
    const cameraCoords = useRef(); // make sure to test search without moving
    
    const handleCameraUpdate = event => cameraCoords.current = event.viewState;
    
    const openAboutCard = () => changeCardPresentation({ action: 'open', card: 'about' });
    
    const openStop = async id => {
        if (!id) { setStopDetails({}); return; }
        
        const response = await queryHelper({
            method: 'post',
            url: '/api/stop-details',
            data: { id }
        }, setErrorStatus);
        
        setStopDetails({ id, ...response.data });
        setFlyCoords([
            response.data.coordinates.longitude,
            response.data.coordinates.latitude
        ]);
        changeCardPresentation({ action: 'open', card: 'stopDetails' });
    };
    
    return pug`
        #sidebar-container
            h1.title
                a(onClick=openAboutCard)= title
            Search(
                openStop=openStop
                cameraCoords=cameraCoords
            )
            CardWrapper(
                styleName="about"
                isOpen=openedCards.about
                changeCardPresentation=changeCardPresentation
            )
                About
            CardWrapper(
                styleName="stop-details"
                isOpen=openedCards.stopDetails
                changeCardPresentation=changeCardPresentation
            )
                StopDetails(
                    details=stopDetails
                )
            CardWrapper(
                styleName="review-form"
                isOpen=openedCards.reviewForm
                changeCardPresentation=changeCardPresentation
            )
                ReviewForm(
                    details=stopDetails
                )
        Map(
            flyCoords=flyCoords
            onCameraUpdate=handleCameraUpdate
            openStop=openStop
        )
    `;
};