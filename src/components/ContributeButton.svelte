<script>
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const switchToReviewForm = () => {
        goto($page.url.pathname + '/review');
    };
</script>

<Button
    class="review-contribute"
    onclick={ switchToReviewForm }
>
    <Icon name="add" />
    Contribute a review
</Button>