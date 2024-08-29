<script>
    import { setContext } from 'svelte';
    import { createForm } from '$lib/stores.svelte';
    import { formDataFetch } from '$lib/fetch';

    import '$assets/styles/components/form.scss';

    const {
        onSubmit,
        onResponse,
        children,
        ...passthroughProps
    } = $props();

    const formStore = createForm();
    setContext('form', formStore);

    const handleSubmit = async event => {
        event.preventDefault();
        onSubmit?.();
        formStore.isLoading = true;
        
        const response = await formDataFetch({
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