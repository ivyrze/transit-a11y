import { jsonFetch } from '$lib/fetch';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ fetch }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/map-bounds',
        method: 'GET'
    });

    return data;
};