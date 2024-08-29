<script>
    import FormError from '$components/primitives/FormError.svelte';
    import { getContext } from 'svelte';
    import { uniqueId } from '$lib/utils';

    let {
        as = 'input',
        id,
        name,
        children,
        ...passthroughProps
    } = $props();

    const formStore = getContext('form');
    const key = uniqueId('form__input');

    let input = $state();

    const hasError = $derived(Boolean(formStore.errors[name]));
    
    const handleBlur = () => {
        const browserError = input.validationMessage;
        if (browserError) {
            const validity = input.validity;
            for (const validityReason in validity) {
                if (validityReason == 'customError') {
                    continue;
                } else if (validity[validityReason]) {
                    formStore.errors[name] = browserError;
                    return;
                }
            }
        }
        
        delete formStore.errors[name];
    };

    const handleInvalid = event => event.preventDefault();

    $effect(() => {
        input.setCustomValidity(formStore.errors[name] ?? '');
    });
</script>

{#if children}
    <label for={ key }>
        {@render children()}
    </label>
{/if}
<svelte:element
    bind:this={ input }
    this={ as }
    id={ key }
    { name }
    onblur={ handleBlur }
    oninvalid={ handleInvalid }
    aria-invalid={ hasError }
    { ...passthroughProps }
/>
<FormError { name } />