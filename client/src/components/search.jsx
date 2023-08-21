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
    
    return (
        <form id="search-container"
            action="/api/search"
            method="post"
            role="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onSubmit={ handleSubmit }
        >
            <input
                type="search"
                name="search"
                placeholder="Search by station..."
                aria-autocomplete="list"
                onInput={ handleInput }
            />
            <div className="search-actions">
                <button
                    className="search-submit"
                    aria-label="Submit search"
                    { ...!results.length && { disabled: 'disabled' }}
                >
                    <Icon name="search" />
                </button>
                { geolocationEnabled && (
                    <button
                        type="button"
                        onClick={ onGeolocationTriggered }
                        aria-label="Show current location"
                    >
                        <Icon name="location" />
                    </button>
                ) }
            </div>
            <ul
                id="search-results-container"
                aria-label="Search results"
            >
                <SearchResults
                    results={ results }
                    openStop={ openStopAndClear }
                />
            </ul>
        </form>
    );
};