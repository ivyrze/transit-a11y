<script>
    import Link from '$components/primitives/Link.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import Select from '$components/primitives/Select.svelte';
    import SelectItem from '$components/primitives/SelectItem.svelte';
    import RouteIcon from '$components/RouteIcon.svelte';
    import CardClose from '$components/CardClose.svelte';

    import '$assets/styles/components/route-list.scss';

    const { data } = $props();

    const defaultAgency = data?.agencies.find(agency => {
        return agency.default === true;
    });
    let selectValue = $state({
        value: defaultAgency.id, label: defaultAgency.name
    });
    
    const routes = $derived(data?.routes.filter(route => {
        return route.id.startsWith(selectValue.value);
    }));
</script>

<svelte:head>
    <title>Routes | is the metro accessible?</title>
</svelte:head>

<main class="sidebar-card">
    <div class="card__header">
        <h1 class="card__alt-heading">Route explorer</h1>
        <div class="card__actions">
            <CardClose />
        </div>
    </div>
    <div class="route-list">
        <Select bind:value={ selectValue }>
            {#each data.agencies as agency}
                <SelectItem
                    label={ agency.name }
                    value={ agency.id }
                />
            {/each}
        </Select>
        {#each routes as route}
            <Link
                class="button--filled"
                href={ "/route/" + route.id }
                style={ "background-color:" + route.color }
            >
                { route.name }
                <RouteIcon
                    number={ route.number }
                    color={ route.color }
                    inverted={ true }
                />
                <Icon
                    name="chevron-right"
                    class="icon--fixed-right"
                />
            </Link>
        {/each}
        {#if !routes.length}
            <p>There are no nearby routes.</p>
        {/if}
    </div>
</main>