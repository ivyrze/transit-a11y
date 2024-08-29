<script>
    import clsx from 'clsx';
    import AccessibilityState from '$components/AccessibilityState.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import i18n from "$lib/i18n-strings.json";

    import '$assets/styles/components/tag-list.scss';

    const { state, tags, rounded = false } = $props();
</script>

<ul
    class={ clsx(
        "tag-list", { "tag-list--rounded": rounded }
    ) }
>
    {#if state}
        <li>
            <AccessibilityState
                class="stop-accessibility-state"
                state={ state }
                showHeading="group"
            />
        </li>
    {/if}
    {#each tags as tag}
        <li class="stop-tag">
            <Icon name={ tag } />
            { i18n.tagLabels[tag] }
        </li>
    {/each}
</ul>