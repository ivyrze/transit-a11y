<script>
    import Select from '$components/primitives/Select.svelte';
    import SelectGroup from '$components/primitives/SelectGroup.svelte';
    import SelectItem from '$components/primitives/SelectItem.svelte';
    import AccessibilityState from '$components/AccessibilityState.svelte';
    import { accessibilityGroups, accessibilityStates } from '$lib/a11y-states';

    const { name = 'accessibility' } = $props();

    let value = $state([]);

    const groups = [ ...accessibilityGroups.keys() ]
        .filter(group => group !== 'unknown')
        .map(group => {
            return [ ...accessibilityStates ]
                .filter(state => state[1].group === group)
                .filter(state => !state[1].unreviewable)
                .map(state => state[0]);
        })
        .filter(group => group.length);
</script>

<Select
    { name }
    bind:value={ value }
    multiple={ true }
>
    {#snippet label()}
        {#if value.length == 0}
            <AccessibilityState
                state="unknown"
                showIcon={ false }
            />
        {:else if value.length == 1}
            <AccessibilityState
                state={ value[0].value }
                showIcon={ false }
            />
        {:else}
            { value.length + " states selected" }
        {/if}
    {/snippet}
    {#each groups as states}
        <SelectGroup>
            {#snippet label()}
                <AccessibilityState
                    state={ states[0] }
                    showHeading="group"
                    showIcon={ false }
                />
            {/snippet}
            {#each states as state}
                <SelectItem value={ state }>
                    <AccessibilityState
                        state={ state }
                        showIcon={ false }
                    />
                </SelectItem>
            {/each}
        </SelectGroup>
    {/each}
</Select>