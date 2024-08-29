<script>
    import { melt, createDropdownMenu } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';

    import '$assets/styles/components/menu.scss';

    const {
        triggerIcon = "ellipsis",
        'aria-label': ariaLabel = "Toggle options menu",
        children,
        ...passthroughProps
    } = $props();

    const menuStore = createDropdownMenu({
        positioning: {
            placement: 'bottom-end'
        },
        portal: null
    });
    setContext("menu", menuStore);

    const {
        elements: { menu, trigger }
    } = menuStore;
</script>

<Button
    class="menu__toggle button--rounded"
    melt={ trigger }
    aria-label={ ariaLabel }
>
    <Icon name={ triggerIcon } />
</Button>
<div
    class="menu"
    use:melt={ $menu }
    { ...passthroughProps }
>
    {@render children()}
</div>