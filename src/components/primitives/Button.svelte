<script>
    import { emptyMeltElement } from '@melt-ui/svelte';

    import '$assets/styles/components/button.scss';

    const {
        type = 'button',
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
    { type }
    use:melt={ builder }
    { ...passthroughProps }
>
    {@render children()}
</button>