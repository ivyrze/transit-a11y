<script>
    import clsx from 'clsx';
    import { melt, createPopover } from '@melt-ui/svelte';
    import Button from '$components/primitives/Button.svelte';

    import '$assets/styles/components/popover.scss';

    const {
        heading,
        triggerLabel,
        triggerClass = '',
        closeLabel,
        closeClass = '',
        children
    } = $props();

    const {
        elements: { content, overlay, trigger, close, arrow }
    } = createPopover({
        portal: null
    });
</script>

<Button
    type="button"
    melt={ trigger }
    class={ triggerClass }
>
    { triggerLabel }
</Button>
<div use:melt={ $overlay }></div>
<div
    class="popover"
    use:melt={ $content }
>
    <div use:melt={ $arrow }></div>
    <h1>{ heading }</h1>
    <div class="popover__body">
        {@render children()}
    </div>
    <Button
        melt={ close }
        class={ clsx(
            "button--filled", closeClass
        ) }
    >
        { closeLabel }
    </Button>
</div>