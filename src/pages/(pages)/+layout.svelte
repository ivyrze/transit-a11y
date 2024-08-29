<script>
    import Header from '$components/Header.svelte';

    import '$assets/styles/components/page-layout.scss';

    const { children } = $props()
</script>

<Header />
{@render children()}