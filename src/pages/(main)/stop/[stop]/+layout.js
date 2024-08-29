import { jsonFetch } from '$lib/fetch';
import { perspectiveStore } from '$lib/stores.svelte';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ fetch, params }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/stop-details',
        method: 'POST',
        body: {
            id: params.stop,
            perspective: perspectiveStore.perspective
        }
    });

    return data;
};