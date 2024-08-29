<script>
    import { melt, createSelect, createSync } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
    import FormError from '$components/primitives/FormError.svelte';
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';

    import '$assets/styles/components/select.scss';

    let {
        value = $bindable(),
        name,
        label,
        multiple = false,
        children
    } = $props();

    const selectStore = createSelect({
        multiple,
        positioning: {
            fitViewport: true,
            sameWidth: true
        },
        portal: null
    });
    setContext('select', selectStore);

    const {
        elements: { trigger, menu },
        states: { open, selectedLabel }
    } = selectStore;

    const sync = createSync(selectStore.states);
    sync.selected(value, newValue => value = newValue);

    let iterableValue = $derived(
        Array.isArray(value) ? value : [ value ]
    );
</script>

<Button
    class="select"
    melt={ trigger }
>
    {#if label}
        {@render label()}
    {:else}
        { $selectedLabel }
    {/if}
    <Icon
        name={ $open ? "chevron-up" : "chevron-down" }
        class="icon--fixed-right"
    />
</Button>
<div
    class="select__popover"
    use:melt={ $menu }
>
    {@render children()}
</div>
{#if name}
    <select
        { name }
        { multiple }
        class="select__hidden"
    >
        {#each iterableValue as subValue}
            <option
                value={ subValue.value }
                selected
            >
                { subValue.label }
            </option>
        {/each}
    </select>
    <FormError { name } />
{/if}