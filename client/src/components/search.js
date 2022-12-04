import React, { useState } from 'react';
import { SearchResults } from './search-results';
import { Icon } from './icon';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';

export const Search = props => {
    const { openStop, cameraCoords } = props;
    
    const [ results, setResults ] = useState([]);
    const { setErrorStatus } = useErrorStatus();
    
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
        openStop(id);
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
            button.search-submit(
                aria-label="Submit search"
            )
                Icon(name= "search")
            ul#search-results-container(
                aria-label="Search results"
            )
                SearchResults(
                    results=results
                    openStop=openStopAndClear
                )
    `;
};