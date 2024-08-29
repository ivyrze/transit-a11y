<script>
    import { emptyMeltElement } from '@melt-ui/svelte';

    import '$assets/styles/components/button.scss';

    const {
        melt = emptyMeltElement,
        meltParams,
        children,
        ...passthroughProps
    } = $props();

    let builder = $derived(
        meltParams ? $melt(meltParams) : $melt
    );
</script>

<button
    use:melt={ builder }
    { ...passthroughProps }
>
    {@render children()}
</button>