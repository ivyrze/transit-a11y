<script>
    import { setContext } from 'svelte';
    import { createForm } from '$lib/stores.svelte';
    import { formDataFetch, formAttachmentFetch } from '$lib/fetch';

    import '$assets/styles/components/form.scss';

    const {
        onSubmit,
        onResponse,
        hasAttachments = false,
        children,
        ...passthroughProps
    } = $props();

    const formStore = createForm();
    setContext('form', formStore);

    const handleSubmit = async event => {
        event.preventDefault();
        onSubmit?.();
        formStore.isLoading = true;

        const fetcher = hasAttachments ?
            formAttachmentFetch : formDataFetch;
        const response = await fetcher({
            form: event.target
        });
        
        formStore.isLoading = false;
        formStore.errors = response.errors ?? {};

        if (!response.errors) {
            onResponse(response);
        }
    };
</script>

<form
    onsubmit={ handleSubmit }
    { ...passthroughProps }
>
    {@render children()}
</form>