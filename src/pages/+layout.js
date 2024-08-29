import { jsonFetch } from '$lib/fetch';
import { authStore } from '$lib/stores.svelte';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ fetch }) => {
    const data = await jsonFetch({
        fetch,
        url: '/api/check-auth',
        method: 'GET'
    });

    authStore.update(data);
};