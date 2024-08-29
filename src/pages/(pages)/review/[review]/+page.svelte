<script>
    import Form from "$components/primitives/Form.svelte";
    import Button from "$components/primitives/Button.svelte";
    import Icon from "$components/primitives/Icon.svelte";
    import AuthorLink from "$components/AuthorLink.svelte";
    import FormInput from "$components/primitives/FormInput.svelte";
    import FormSubmit from "$components/primitives/FormSubmit.svelte";
    import ReviewActions from "$components/ReviewActions.svelte";
    import AttachmentViewer from "$components/AttachmentViewer.svelte";
    import AccessibilityState from "$components/AccessibilityState.svelte";
    import AccessibilitySelect from "$components/AccessibilitySelect.svelte";
    import CommentsInput from "$components/CommentsInput.svelte";
    import TagList from "$components/TagList.svelte";
    import { invalidate } from '$app/navigation';
    import { page } from '$app/stores';

    import "$assets/styles/components/review-details.scss";

    const { data } = $props();

    let deleted = $state(false);
    let editing = $state(false);

    const timestampFormatted = new Intl.DateTimeFormat(false, {
        dateStyle: 'full', timeStyle: 'short'
    }).format(new Date(data.timestamp));

    const invalidatePage = () => invalidate('/api/review-details');
</script>

<svelte:head>
    <title>{ data.stop.name }</title>
</svelte:head>

{#snippet fallbackValue()}
    <p class="review-details__fallback">
        None provided.
    </p>
{/snippet}

<main class="page-fullscreen">
    <Form
        class="review-details"
        action="/api/edit-review"
        method="POST"
        autocomplete="off"
        onResponse={ invalidatePage }
        onSubmit={ () => editing = false }
    >
        <div class="review-details__header">
            <h1>
                {#if deleted}
                    <del>{ data.stop.name }</del>
                {:else}
                    { data.stop.name }
                {/if}
            </h1>
            {#if !deleted}
                <ReviewActions
                    review={ data }
                    onEdit={ () => editing = true }
                    onDelete={ () => { editing = false; deleted = true; } }
                    onArchive={ invalidatePage }
                />
            {/if}
        </div>
        <div class="review-details__author">
            <span class="subtitle">Review by </span>
            <AuthorLink author={ data.author } />
        </div>
        <div class="review-details__field">
            <h2>Timestamp</h2>
            <p class="review-details__timestamp">
                <time datetime={ data.timestamp }>
                    { timestampFormatted }
                </time>
                {#if data.archived}
                    <Icon name="archived" title="Archived review" />
                {/if}
            </p>
        </div>
        <div class="review-details__field">
            <h2>Accessibility state</h2>
            {#if editing}
                <AccessibilitySelect />
            {:else}
                {#each data.accessibility as accessibility}
                    <AccessibilityState
                        class="accessibility-state"
                        state={ accessibility }
                    />
                {/each}
            {/if}
        </div>
        <div class="review-details__field">
            <h2>Feature tags</h2>
            {#if data.tags?.length}
                <TagList tags={ data.tags } />
            {:else}
                {@render fallbackValue()}
            {/if}
        </div>
        <div class="review-details__field">
            <h2>Comments</h2>
            {#if editing}
                <CommentsInput />
            {:else if data.comments}
                <p>{ data.comments }</p>
            {:else}
                {@render fallbackValue()}
            {/if}
        </div>
        <div class="review-details__field">
            <h2>Attachments</h2>
            {#if data.attachments?.length}
                <AttachmentViewer attachments={ data.attachments } />
            {:else}
                {@render fallbackValue()}
            {/if}
        </div>
        {#if editing}
            <FormInput
                type="hidden"
                name="id"
                value={ $page.params.review }
            />
        {/if}
        {#if editing}
            <div class="button-set">
                <FormSubmit class="button--filled button--primary" />
                <Button
                    class="button--filled"
                    type="button"
                    onclick={ () => editing = false }
                >
                    Cancel
                </Button>
            </div>
        {/if}
    </Form>
</main>