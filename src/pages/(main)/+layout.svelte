<script>
    import Header from "$components/Header.svelte";
    import Search from "$components/Search.svelte";
    import Map from "$components/Map.svelte";

    import '$assets/styles/components/card-layout.scss';

    const { data, children } = $props();
</script>

<div id="sidebar-container">
    <Header minimal>
        <Search />
    </Header>
    {@render children()}
</div>
<Map initialBounds={ data.bounds } />