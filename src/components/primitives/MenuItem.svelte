<script>
    import Button from '$components/primitives/Button.svelte';
    import Link from '$components/primitives/Link.svelte';
    import { getContext } from 'svelte';

    const {
        type = 'button',
        children,
        ...passthroughProps
    } = $props();

    const {
        elements: { item }
    } = getContext('menu');

    const MenuItemChild =
        type == 'link' ? Link : Button;
</script>

<MenuItemChild
    class="menu__item"
    melt={ item }
    { ...passthroughProps }
>
    {@render children()}
</MenuItemChild>