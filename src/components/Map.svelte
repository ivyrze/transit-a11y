<script>
    import { MapLibre, GeolocateControl, Layer } from 'svelte-maplibre';
    import { mapStore } from '$lib/stores.svelte';
    import { styleFactory } from '$lib/map-style.svelte';
    import { goto } from '$app/navigation';

    import '$assets/styles/components/map.scss';

    const { initialBounds } = $props();

    const style = $derived(styleFactory());

    const handleClick = event => {
        const feature = event.detail.features[0];
        goto('/stop/' + feature.properties.stop_id);
    };

    const handleLoad = () => mapStore.isLoaded = true;
    $effect(() => () => mapStore.isLoaded = false);

    const prefixHostname = (url, type) => {
        if (url.startsWith('/')) {
            return { url: window.location.origin + url, type };
        }
    };
</script>

<MapLibre
    bind:map={ mapStore.map }
    on:load={ handleLoad }
    class="map-container"
    bounds={ initialBounds }
    style={ style }
    diffStyleUpdates={ true }
    transformRequest={ prefixHostname }
>
    <Layer
        id="stops-icon"
        source="api"
        minzoom="8"
        hoverCursor="pointer"
        on:click={ handleClick }
    />
    <Layer
        id="stops-label"
        source="api"
        minzoom="11"
        hoverCursor="pointer"
        on:click={ handleClick }
    />
    <GeolocateControl
        bind:control={ mapStore.geolocateControl }
    />
</MapLibre>