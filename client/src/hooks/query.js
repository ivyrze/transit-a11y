import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect'
import axios from 'axios';
import { useErrorStatus } from './error';

export const useQuery = props => {
    const [ response, setResponse ] = useState();
    const { setErrorStatus } = useErrorStatus();
    
    useDeepCompareEffect(() => {
        const helperRunner = async () => {
            setResponse(await queryHelper(props, setErrorStatus));
        };
        helperRunner();
    }, [ props, setErrorStatus ]);
    
    return response;
};

export const queryHelper = (options, setErrorStatus) => {
    return axios(options).catch(error => {
        setErrorStatus(error.request.status);
        throw error;
    });
};