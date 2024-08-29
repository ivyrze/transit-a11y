<script>
    import { melt, createCollapsible } from '@melt-ui/svelte';
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import i18n from '$lib/i18n-strings.json';
    
    import '$assets/styles/components/review-drawer.scss';
    
    const { children } = $props();
    
    const {
        elements: { root, content, trigger },
        states: { open },
    } = createCollapsible();
</script>

<div use:melt={ $root }>
    <Button
        class="review-drawer-toggle"
        melt={ trigger }
    >
        { i18n.reviewsToggleStates[$open ? 'hide' : 'show'] }
        <Icon
            name={ $open ? "chevron-up" : "chevron-down" }
            class="icon--fixed-right"
        />
    </Button>
    <div use:melt={ $content }>
        {@render children()}
    </div>
</div>