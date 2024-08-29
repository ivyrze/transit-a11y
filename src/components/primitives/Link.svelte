<script>
    import { page } from '$app/stores';
    import { emptyMeltElement } from '@melt-ui/svelte';

    import '$assets/styles/components/link.scss';

    const {
        href,
        currentAware = false,
        melt = emptyMeltElement,
        children,
        ...passthroughProps
    } = $props();

    const currentValue =
        currentAware && $page.url.pathname == href ?
        'page' : undefined;
</script>

<a
    { href }
    aria-current={ currentValue }
    use:melt
    { ...passthroughProps }
>
    {@render children()}
</a>