<script>
    import SearchResults from '$components/SearchResults.svelte';
    import Form from '$components/primitives/Form.svelte';
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import { mapStore } from '$lib/stores.svelte';
    import { jsonFetch } from '$lib/fetch';
    import { goto } from '$app/navigation';

    import '$assets/styles/components/search.scss';

    let results = $state([]);
    let searchText = $state('');
    let geolocationEnabled = $state(false);

    $effect(async () => {
        if (searchText.length < 2) {
            results = [];
            return;
        }

        const data = await jsonFetch({
            fetch,
            url: '/api/search',
            method: 'POST',
            body: {
                query: searchText
            },
        });

        results = data.results;
    });
    
    $effect(async () => {
        if (!navigator.permissions || !navigator.geolocation) { return; }
        
        const permissions = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permissions.state === 'granted' || permissions.state === 'prompt') {
            geolocationEnabled = true;
        }
    });

    const handleSubmit = event => {
        event.preventDefault();
        handleOpen(results[0].id);
    };

    const handleOpen = id => {
        searchText = '';
        goto('/stop/' + id);
    };
</script>

<Form
    id="search-container"
    role="search"
    autoComplete="off"
    autoCorrect="off"
    spellCheck="false"
    onsubmit={ handleSubmit }
>
    <input
        type="search"
        name="search"
        placeholder="Search by stop name..."
        aria-autocomplete="list"
        bind:value={ searchText }
    />
    <div class="search-actions">
        <Button
            class="search-submit"
            aria-label="Submit search"
            { ...!results?.length && { disabled: 'disabled' }}
        >
            <Icon name="search" />
        </Button>
        {#if geolocationEnabled}
            <Button
                onclick={ () => mapStore.geolocateControl.trigger() }
                aria-label="Show current location"
            >
                <Icon name="location" />
            </Button>
        {/if}
    </div>
    <SearchResults
        results={ results }
        onOpen={ handleOpen }
    />
</Form>