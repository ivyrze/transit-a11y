<script>
    import Button from '$components/primitives/Button.svelte';
    import RouteIcon from '$components/RouteIcon.svelte';

    import '$assets/styles/components/search-results.scss';

    const { results = [], onOpen } = $props();
</script>

<ul
    id="search-results-container"
    aria-label="Search results"
>
    {#each results as result}
        <li>
                <Button
                    class="search-result"
                    type="button"
                    onclick={ () => onOpen(result.id) }
                >
                    { result.name }
                    {#each result.routes as route}
                        <RouteIcon
                            number={ route.number }
                            color={ route.color }
                        />
                    {/each}
                </Button>
            </li>
    {/each}
</ul>