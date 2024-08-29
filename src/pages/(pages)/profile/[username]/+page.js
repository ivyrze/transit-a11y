import { jsonFetch } from '$lib/fetch';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, url, params }) => {
    const currentPage = parseInt(
        url.searchParams.get('page') ?? 1
    );
    
    const data = await jsonFetch({
        fetch,
        url: '/api/profile',
        method: 'POST',
        body: {
            username: params.username,
            page: currentPage
        }
    });

    return data;
};