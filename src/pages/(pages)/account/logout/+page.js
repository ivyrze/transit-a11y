import { jsonFetch } from '$lib/fetch';
import { authStore } from '$lib/stores.svelte';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
    await jsonFetch({
        fetch,
        url: '/api/account/logout',
        method: 'GET'
    });
    
    authStore.clear();
};