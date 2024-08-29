<script>
    import FormInput from '$components/primitives/FormInput.svelte';
    import Popover from '$components/primitives/Popover.svelte';
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';

    import '$assets/styles/components/attachment-input.scss';

    const { name = 'attachments' } = $props();

    let files = $state();
    $inspect(files, files?.length);
    let previews = $derived(Array.from(files ?? []).map(file => {
        return URL.createObjectURL(file);
    }));

    const handleCleanup = src => URL.revokeObjectURL(src);

    const handleDelete = index => {
        const updatedFiles = Array.from(files);
        updatedFiles.splice(index, 1);

        if (updatedFiles.length) {
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach(file => {
                dataTransfer.items.add(file);
            });
            files = dataTransfer.files;
        } else {
            files = undefined;
        }
    };
</script>

<ol class="attachment-input attachment-list">
    {#each previews as preview, index}
        <li class="attachment">
            <img
                src={ preview }
                onload={ () => handleCleanup(preview) }
            />
            <div class="attachment__actions">
                <Popover
                    heading="Image description"
                    triggerLabel="+Alt"
                    triggerClass="button--overlay attachment__alt"
                    closeLabel="Done"
                    closeClass="button--filled button--primary"
                >
                    <FormInput
                        name={ "attachmentsAlt[" + files[index].name + "]" }
                        as="textarea"
                        placeholder="Describe the content of your image for other users"
                    />
                </Popover>
                <Button
                    type="button"
                    class="button--overlay"
                    aria-label="Delete attachment"
                    onclick={ () => handleDelete(index) }
                >
                    <Icon name="close" />
                </Button>
            </div>
        </li>
    {/each}
    <li class="attachment-input__upload">
        <input
            bind:files={ files }
            type="file"
            { name }
            multiple
        />
        <Icon name="upload" />
    </li>
</ol>