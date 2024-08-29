<script>
    import FormInput from '$components/primitives/FormInput.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import i18n from '$lib/i18n-strings.json';

    import '$assets/styles/components/tag-select.scss';

    const tags = [ 'bench', 'shelter', 'display', 'heating' ];
</script>

<ul class="tag-select">
    {#each tags as tag}
        <li class="tag-select__option">
            <FormInput
                type="checkbox"
                id={ "feature-" + tag }
                name="features"
                value={ tag }
            >
                <Icon name={ tag } />
                { i18n.tagLabels[tag] }
            </FormInput>
        </li>
    {/each}
</ul>