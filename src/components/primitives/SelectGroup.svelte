<script>
    import { melt } from '@melt-ui/svelte';
    import { getContext } from 'svelte';
    import { uniqueId } from '$lib/utils';

    const { label, children, ...passthroughProps } = $props();

    const {
        elements: { group, groupLabel }
    } = getContext('select');

    const key = uniqueId('select__group');
</script>

<div
    class="select__group"
    use:melt={ $group(key) }
    { ...passthroughProps }
>
    <div
        class="select__group-label"
        use:melt={ $groupLabel(key) }
    >
        {#if label instanceof Function}
            {@render label()}
        {:else}
            {label}
        {/if}
    </div>
    {@render children()}
</div>