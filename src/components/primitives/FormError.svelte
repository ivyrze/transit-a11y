<script>
    import Icon from '$components/primitives/Icon.svelte';
    import { getContext } from 'svelte';

    import '$assets/styles/components/form-error.scss';

    const { name } = $props();

    const formStore = getContext('form');
    const errorMessage = $derived(formStore.errors[name]);
</script>

{#if errorMessage}
    <div
        class="form-error"
        role="alert"
    >
        <Icon name="invalid" />
        { errorMessage }
    </div>
{/if}