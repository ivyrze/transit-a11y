<script>
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import { getContext } from 'svelte';

    const { ...passthroughProps } = $props();

    const formStore = getContext('form');
</script>

<Button
    type="submit"
    class="button--filled button--primary"
    disabled={ formStore.isLoading }
    { ...formStore.isLoading && { 'aria-label': 'Loading...' } }
    { ...passthroughProps }
>
    {#if formStore.isLoading}
        <Icon name="spinner" />
    {:else}
        Submit
    {/if}
</Button>