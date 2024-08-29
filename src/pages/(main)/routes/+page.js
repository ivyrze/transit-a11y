import { jsonFetch } from '$lib/fetch';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/route-list',
        method: 'GET'
    });

    return data;
};