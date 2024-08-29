<script>
    import Link from '$components/primitives/Link.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import AccessibilityState from '$components/AccessibilityState.svelte';
    import AuthorLink from '$components/AuthorLink.svelte';
    import TimeAgo from '$components/TimeAgo.svelte';
    import AttachmentViewer from '$components/AttachmentViewer.svelte';

    import '$assets/styles/components/review.scss';

    const { review } = $props();
</script>

<article class="review">
    <div class="review__header">
        {#if review.author}
            <AuthorLink author={ review.author } />
        {:else}
            <Link
                href={ "/stop/" + review.stop.id }
                class="review__stop link--minimal"
            >
                { review.stop.name }
            </Link>
        {/if}
        <div class="review__actions">
            {#if review.archived}
                <Icon name="archived" title="Archived review" />
            {/if}
            <Link
                href={ "/review/" + review.id }
                class="link--minimal"
            >
                <TimeAgo
                    class="review__timestamp"
                    date={ review.timestamp }
                />
            </Link>
        </div>
    </div>
    {#each review.accessibility as accessibility}
        <AccessibilityState
            class="accessibility-state"
            state={ accessibility }
            archived={ review.archived }
        />
    {/each}
    {#if review.comments}
        <p>{ review.comments }</p>
    {/if}
    {#if review.attachments?.length}
        <AttachmentViewer attachments={ review.attachments } />
    {/if}
</article>