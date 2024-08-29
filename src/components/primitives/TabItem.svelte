<script>
    import clsx from 'clsx';
    import Button from '$components/primitives/Button.svelte';
    import { getContext } from 'svelte';

    const { id, children, ...passthroughProps } = $props();

    const {
        elements: { trigger },
        states: { value }
    } = getContext('tab-list');
</script>

<Button
    class={ clsx(
        "tab-item", { active: $value == id }
    ) }
    melt={ trigger }
    meltParams={ id }
    { ...passthroughProps }
>
    {@render children()}
</Button>