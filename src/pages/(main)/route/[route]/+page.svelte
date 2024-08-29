<script>
    import TabList from '$components/primitives/TabList.svelte';
    import TabItem from '$components/primitives/TabItem.svelte';
    import TabPanel from '$components/primitives/TabPanel.svelte';
    import Link from '$components/primitives/Link.svelte';
    import AccessibilityState from '$components/AccessibilityState.svelte';
    import RouteIcon from '$components/RouteIcon.svelte';
    import CardClose from '$components/CardClose.svelte';
    import i18n from '$lib/i18n-strings.json';
    import { page } from '$app/stores';
    import { mapStore } from '$lib/stores.svelte';

    import '$assets/styles/components/route-details.scss';

    const { data } = $props();

    $effect(() => {
        const stopIds = data.directions
            .map(direction => direction.segments).flat()
            .map(segment => segment.branches).flat()
            .map(branch => branch.stops).flat()
            .map(relation => relation.stop.id);

        mapStore.stopVisibility = stopIds;
        mapStore.routeVisibility = [ $page.params.route ];

        return () => {
            mapStore.stopVisibility = [];
            mapStore.routeVisibility = [];
        };
    });
</script>

<svelte:head>
    <title>{ data.name } | is the metro accessible?</title>
</svelte:head>

<main class="sidebar-card route-details-card">
    <div class="card__header">
        <h1>{ data.name }</h1>
        <RouteIcon
            number={ data.number }
            color={ data.color }
        />
        <div class="card__actions">
            <CardClose />
        </div>
    </div>
    <span class="subtitle">
        { i18n.routeSubheadings[data.agency.vehicle] }
    </span>
    <TabList defaultValue={ data.directions[0].heading }>
        {#snippet tabs()}
            {#each data.directions as direction}
                <TabItem id={ direction.heading }>
                    { i18n.directionHeadings[direction.heading] }
                </TabItem>
            {/each}
        {/snippet}
        {#each data.directions as direction}
            <TabPanel id={ direction.heading }>
                <ul class="stop-list-tree">
                    {#each direction.segments as segment}
                        {#if segment.branches.length > 1}
                            <div class="branch-set">
                                {#each segment.branches as branchValues, branchIndex}
                                    <div class={
                                        branchIndex == 0 ? "branch-base" : "branch-deviation"
                                    }>
                                        {@render branch(branchValues)}
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            {@render branch(segment.branches[0])}
                        {/if}
                    {/each}
                </ul>
            </TabPanel>
        {/each}
    </TabList>
</main>

{#snippet branch({ stops })}
    {#each stops as { stop }}
        <li>
            <AccessibilityState
                class="stop-icon"
                state={ stop.accessibility }
                showHeading={ false }
                showIcon="alt"
            />
            <Link
                href={ "/stop/" + stop.id }
                class="link--minimal"
            >
                { stop.name }
            </Link>
        </li>
    {/each}
{/snippet}