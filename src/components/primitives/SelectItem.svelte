<script>
    import clsx from 'clsx';
    import Icon from '$components/primitives/Icon.svelte';
    import { melt } from '@melt-ui/svelte';
    import { getContext } from 'svelte';

    const {
        value,
        label = value,
        children,
        ...passthroughProps
    } = $props();

    const {
        elements: { option },
        helpers: { isSelected }
    } = getContext('select');
</script>

<div
    class={ clsx(
        "select__item",
        { "active": $isSelected(value) }
    ) }
    use:melt={ $option({ label, value }) }
    { ...passthroughProps }
>
    {#if children}
        {@render children()}
    {:else}
        { label }
    {/if}
    {#if $isSelected(value)}
        <Icon
            name="check"
            class="icon--fixed-right"
        />
    {/if}
</div>