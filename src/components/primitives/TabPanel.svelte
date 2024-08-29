<script>
    import { melt } from '@melt-ui/svelte';
    import { getContext } from 'svelte';

    const { id, children, ...passthroughProps } = $props();

    const {
        elements: { content }
    } = getContext('tab-list');
</script>

<div
    use:melt={ $content(id) }
    { ...passthroughProps }
>
    {@render children()}
</div>