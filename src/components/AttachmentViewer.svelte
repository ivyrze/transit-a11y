<script>
    import BiggerPicture from 'bigger-picture';
    import Popover from '$components/primitives/Popover.svelte';
    import Button from '$components/primitives/Button.svelte';
    import { browser } from '$app/environment';

    import 'bigger-picture/css';
    import '$assets/styles/components/attachment-viewer.scss';

    const { attachments } = $props();

    const urlForSize = (filename, quality) =>
        "/api/attachment/" + quality + "/" + filename;

    let itemRefs = $state([]);
    const items = $derived(attachments.map((attachment, index) => {
        const large = attachment.sizes.find(size => size.quality == 'large');
        return {
            img: urlForSize(attachment.filename, 'large'),
            thumb: urlForSize(attachment.filename, 'small'),
            width: large.width,
            height: large.height,
            alt: attachment.alt,
            element: itemRefs[index]
        };
    }));

    const lightbox = browser && BiggerPicture({
        target: document.body
    });
</script>

<ol class="attachment-viewer attachment-list">
    {#each items as item, index}
        <li class="attachment">
            <Button
                class="attachment__enlarge"
                onclick={ () => lightbox.open({
                    items, position: index, scale: 0.9
                }) }
            >
                <img
                    src={ item.thumb }
                    alt={ item.alt }
                    bind:this={ itemRefs[index] }
                />
            </Button>
            {#if item.alt}
                <div class="attachment__actions">
                    <Popover
                        heading="Image description"
                        triggerLabel="Alt"
                        triggerClass="button--overlay attachment__alt"
                        closeLabel="Dismiss"
                    >
                        { item.alt }
                    </Popover>
                </div>
            {/if}
        </li>
    {/each}
</ol>