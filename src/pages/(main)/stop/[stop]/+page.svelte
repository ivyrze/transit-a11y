<script>
    import Review from '$components/Review.svelte';
    import ReviewDrawer from '$components/ReviewDrawer.svelte';
    import TagList from '$components/TagList.svelte';
    import CardClose from '$components/CardClose.svelte';
    import ContributeButton from '$components/ContributeButton.svelte';
    import Menu from '$components/primitives/Menu.svelte';
    import MenuItem from '$components/primitives/MenuItem.svelte';
    import Link from '$components/primitives/Link.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import i18n from '$lib/i18n-strings.json';
    import { perspectiveStore } from '$lib/stores.svelte';

    import '$assets/styles/components/stop-details.scss';

    const { data } = $props();

    const gsvURL = $derived(
        'https://www.google.com/maps/@?' +
            new URLSearchParams({
                api: 1,
                map_action: 'pano',
                viewpoint: [
                    data.coordinates.latitude,
                    data.coordinates.longitude
                ].join(',')
            })
    );
</script>

<main class="sidebar-card stop-details-card">
    <div class="card__header">
        <h1>{ data.name }</h1>
        <div class="card__actions">
            <Menu>
                <MenuItem
                    type="link"
                    href={ gsvURL }
                    target="_blank"
                    rel="noreferrer"
                    class="menu__item"
                >
                    Open in Google Street View
                    <Icon name="link" />
                </MenuItem>
            </Menu>
            <CardClose />
        </div>
    </div>
    <span class="subtitle">
        { i18n.stopSubheadings[data.agency.vehicle] }
    </span>
    <TagList
        state={ data.accessibility }
        tags={ data.tags }
        rounded={ true }
    />
    <p class="stop-accessibility-info">
        { data.description ?? i18n.accessibilityStates[data.accessibility].description }
    </p>
    {#if data.reviews}
        <div class="review-container">
            {#if data.reviews.length}
                <ReviewDrawer>
                    {#each data.reviews as review}
                        <Review review={ review } />
                    {/each}
                    <ContributeButton />
                </ReviewDrawer>
            {:else}
                <ContributeButton />
            {/if}
        </div>
    {/if}
    {#if perspectiveStore.perspective == "agency"}
        <span class="source-link">
            Source: <Link target="_blank" href={ data.agency.url } rel="noreferrer" class="link--minimal">{ data.agency.name }</Link>
        </span>
    {/if}
</main>