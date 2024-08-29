<script>
    import clsx from 'clsx';
    import Icon from '$components/primitives/Icon.svelte';
    import i18n from '$lib/i18n-strings.json';
    import { accessibilityStates, accessibilityGroups } from '$lib/a11y-states';

    import '$assets/styles/components/accessibility-state.scss';

    const {
        state,
        class: className,
        showHeading = true,
        showIcon = true,
        archived = false
    } = $props();
    
    const stateProps = $derived(accessibilityStates.get(state));
    const stateGroupProps = $derived(accessibilityGroups.get(stateProps.group));
    
    const stateStrings = $derived(i18n.accessibilityStates[state]);
    const stateGroupStrings = $derived(i18n.accessibilityGroups[stateProps.group]);
    
    const iconAccessibleTitle = $derived(
        stateGroupProps.style.charAt(0).toUpperCase() +
        stateGroupProps.style.slice(1) + " state"
    );
</script>

{#snippet inner()}
    {#if showIcon}
        <Icon
            name={ stateGroupProps.style }
            alt={ showIcon === 'alt' }
            { ...!showHeading && { title: iconAccessibleTitle } }
        />
    {/if}
    {#if showHeading}
        { showHeading === 'group' ?
            stateGroupStrings :
            stateStrings.heading
        }
    {/if}
{/snippet}

<div class={ clsx(
    className, "state-" + stateGroupProps.style
) }>
    {#if archived}
        <del>{@render inner()}</del>
    {:else}
        {@render inner()}
    {/if}
</div>