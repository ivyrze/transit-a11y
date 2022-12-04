import { useEffect, useState } from 'react';
import axios from 'axios';
import { useErrorStatus } from './error';

export const useQuery = props => {
    const { method, url, data, validateStatus } = props;
    
    const [ response, setResponse ] = useState();
    const { setErrorStatus } = useErrorStatus();
    
    useEffect(() => {
        const helperRunner = async () => {
            setResponse(await queryHelper({
                method, url, data, validateStatus
            }, setErrorStatus));
        };
        helperRunner();
    }, [ method, url, data, validateStatus, setErrorStatus ]);
    
    return response;
};

export const queryHelper = async (options, setErrorStatus) => {
    return await axios(options).catch(error => {
        setErrorStatus(error.request.status);
        throw error;
    });
};