<script>
    import { getContext } from 'svelte';
    import { uniqueId } from '$lib/utils';

    const { label, children, ...passthroughProps } = $props();

    const {
        elements: { group, groupLabel }
    } = getContext('menu');
    
    const key = uniqueId('menu__group');
</script>

<div
    class="menu__group"
    use:melt={ $group(key) }
    { ...passthroughProps }
>
    <div
        class="menu__group-label"
        use:melt={ $groupLabel(key) }
    >
        { label }
    </div>
    {@render children()}
</div>