<script>
    import { page } from '$app/stores';
    import { mapStore } from '$lib/stores.svelte';

    const { data, children } = $props();

    $effect(() => {
        if (!mapStore.isLoaded) { return; }

        let padding = {};
        if (window.innerWidth > 768) {
            padding.left = 400;
        }

        mapStore.map.flyTo({
            center: [
                data.coordinates.longitude,
                data.coordinates.latitude
            ],
            padding: padding,
            zoom: 16,
            duration: 2500,
            essential: false
        });
    });

    $effect(() => {
        if (!mapStore.isLoaded) { return; }

        const setStopOpened = (stop, state) => {
            mapStore.map.setFeatureState({
                source: 'api',
                sourceLayer: 'stops',
                id: stop
            }, {
                opened: state
            });
        };
        
        const stop = $page.params.stop;
        setStopOpened(stop, true);

        return () => setStopOpened(stop, false);
    });
</script>

<svelte:head>
    <title>{ data.name } | is the metro accessible?</title>
</svelte:head>

{@render children()}