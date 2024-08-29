import { jsonFetch } from '$lib/fetch';
import { perspectiveStore } from '$lib/stores.svelte';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/route-details',
        method: 'POST',
        body: {
            id: params.route,
            perspective: perspectiveStore.perspective
        }
    });

    return data;
};