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
    
    const isExternal =
        !href.startsWith('/') && !href.startsWith('.');
</script>

<a
    { href }
    { ...(isExternal && { 'target': '_blank' }) }
    { ...(isExternal && { 'rel': 'noreferrer' }) }
    aria-current={ currentValue }
    use:melt
    { ...passthroughProps }
>
    {@render children()}
</a>