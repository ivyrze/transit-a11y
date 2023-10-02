import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import useSWRInfinite from 'swr/infinite';
import { useErrorStatus } from '@hooks/error';

export const useQuery = (key, options) => useBaseQuery(useSWR, key, options);
export const useImmutableQuery = (key, options) => useBaseQuery(useSWRImmutable, key, options);
export const useInfiniteQuery = (key, options) => useBaseQuery(useSWRInfinite, key, options);

export const useBaseQuery = (swr, key, options) => {
    const { setErrorStatus } = useErrorStatus();
    
    return swr(key, async key => {
        const response = await queryHelper(key, setErrorStatus);
        return response.data;
    }, {
        suspense: true,
        ...options
    });
};

export const queryHelper = (options, setErrorStatus) => {
    return axios({
        withCredentials: true,
        ...options
    }).catch(error => {
        setErrorStatus({
            status: error.request.status,
            message: error.request.statusText
        });
        throw error;
    });
};