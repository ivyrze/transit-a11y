import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { useErrorStatus } from './error';

export const useQuery = (key, options) => useBaseQuery(useSWR, key, options);
export const useImmutableQuery = (key, options) => useBaseQuery(useSWRImmutable, key, options);

export const useBaseQuery = (swr, key, options) => {
    const { setErrorStatus } = useErrorStatus();
    
    return swr(key, async key => {
        const queryOptions = {
            ...key,
            data: {
                ...key?.data,
                ...options?.dataNoRevalidate
            }
        };
        
        const response = await queryHelper(queryOptions, setErrorStatus);
        return response.data;
    }, options);
};

export const queryHelper = (options, setErrorStatus) => {
    return axios(options).catch(error => {
        setErrorStatus({
            status: error.request.status,
            message: error.request.statusText
        });
        throw error;
    });
};