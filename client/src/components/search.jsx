import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchResults } from './search-results';
import { Icon } from './icon';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';

export const Search = props => {
    const { cameraCoords, onGeolocationTriggered } = props;
    
    const [ results, setResults ] = useState([]);
    const [ geolocationEnabled, setGeolocationEnabled ] = useState(false);
    const navigate = useNavigate();
    const { setErrorStatus } = useErrorStatus();
    
    useEffect(() => {
        const checkGeolocationPermissions = async () => {
            if (!navigator.permissions || !navigator.geolocation) { return; }
            
            const permissions = await navigator.permissions.query({ name: 'geolocation' });
            
            if (permissions.state === 'granted' || permissions.state === 'prompt') {
                setGeolocationEnabled(true);
            }
        };
        checkGeolocationPermissions();
    }, []);
    
    const handleInput = async event => {
        if (event.target.value.length < 2) { setResults([]); return; }
        
        const response = await queryHelper({
            method: 'post',
            url: '/api/search',
            data: {
                query: event.target.value,
                longitude: cameraCoords.current.longitude,
                latitude: cameraCoords.current.latitude
            }
        }, setErrorStatus);
        setResults(response.data.results);
    };
    
    const handleSubmit = event => {
        event.preventDefault();
        openStopAndClear(results[0].id);
    };
    
    const openStopAndClear = id => {
        navigate('/stop/' + id);
        setResults([]);
    };
    
    return pug`
        form#search-container(
            action="/api/search"
            method="post"
            role="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onSubmit=handleSubmit
        )
            input(
                type="search"
                name="search"
                placeholder="Search by station..."
                aria-autocomplete="list"
                onInput=handleInput
            )
            .search-actions
                if results.length
                    button.search-submit(
                        aria-label="Submit search"
                    )
                        Icon(name= "search")
                else
                    button.search-submit(
                        aria-label="Submit search"
                        disabled
                    )
                        Icon(name= "search")
                if geolocationEnabled
                    button(
                        type="button"
                        onClick=onGeolocationTriggered
                        aria-label="Show current location"
                    )
                        Icon(name= "location")
            ul#search-results-container(
                aria-label="Search results"
            )
                SearchResults(
                    results=results
                    openStop=openStopAndClear
                )
    `;
};