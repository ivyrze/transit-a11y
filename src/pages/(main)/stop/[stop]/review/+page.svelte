<script>
    import Form from '$components/primitives/Form.svelte';
    import FormInput from '$components/primitives/FormInput.svelte';
    import FormSubmit from '$components/primitives/FormSubmit.svelte';
    import Button from '$components/primitives/Button.svelte';
    import TagSelect from '$components/TagSelect.svelte';
    import AccessibilitySelect from '$components/AccessibilitySelect.svelte';
    import InfoNotice from '$components/InfoNotice.svelte';
    import CommentsInput from '$components/CommentsInput.svelte';
    import AttachmentInput from '$components/AttachmentInput.svelte';
    import i18n from '$lib/i18n-strings.json';
    import { authStore, mapStore } from '$lib/stores.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const { data } = $props();

    const showStopCard = () => goto('.');
    const closeCard = () => goto('/');

    $effect(() => {
        if (!authStore.username) {
            authStore.redirect = $page.url.pathname;
            goto('/account/login');
        }
    });

    const handleFormResponse = response => {
        if (response?.accessibility) {
            mapStore.overrideStopState(
                $page.params.stop, response.accessibility
            );
        }
        closeCard();
    };
</script>

<main class="sidebar-card review-card">
    <div class="card__header">
        <h1>{ data.name }</h1>
    </div>
    <span class="subtitle">
        { i18n.stopSubheadings[data.agency.vehicle] }
    </span>
    <Form
        action="/api/submit-review"
        method="POST"
        autocomplete="off"
        onResponse={ handleFormResponse }
        hasAttachments={ true }
    >
        <fieldset>
            <legend>What features are available at this stop?</legend>
            <TagSelect />
        </fieldset>
        <fieldset>
            <legend>What's the accessibility state at this stop?</legend>
            {#if authStore.role != 'LIMITED'}
                <AccessibilitySelect />
            {:else}
                <InfoNotice iconName="lock">You don't have permissions to set an accessibility state.</InfoNotice>
            {/if}
        </fieldset>
        <fieldset>
            <legend>Any additional comments?</legend>
            <CommentsInput />
        </fieldset>
        <fieldset>
            <legend>Do you have any photos to include?</legend>
            <AttachmentInput />
        </fieldset>
        <fieldset class="button-set">
            <FormSubmit />
            <Button
                class="button--filled"
                onclick={ showStopCard }
            >
                Cancel
            </Button>
        </fieldset>
        <FormInput
            type="hidden"
            name="stop"
            value={ $page.params.stop }
        />
    </Form>
</main>