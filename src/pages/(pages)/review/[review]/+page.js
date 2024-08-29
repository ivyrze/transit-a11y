import { jsonFetch } from '$lib/fetch';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/review-details',
        method: 'POST',
        body: {
            id: params.review
        }
    });

    return data;
};