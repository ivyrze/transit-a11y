<script>
    import Button from '$components/primitives/Button.svelte';
    import Review from '$components/Review.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    import '$assets/styles/components/profile.scss';

    const { data } = $props();

    const reviewCount = `${new Intl.NumberFormat().format(data.count)} review${data.count !== 1 ? 's' : ''}`;

    const currentPage = $derived(parseInt(
        $page.url.searchParams.get('page') ?? 1
    ));
    const moreReviewsAvailable = $derived(
        data.count > ((currentPage - 1) * 25 + data.reviews.length)
    );

    const incrementPage = () => {
        const searchParams = new URLSearchParams(
            $page.url.searchParams.toString()
        );
        searchParams.set('page', currentPage + 1);
        goto('?' + searchParams.toString());
    };
</script>

<svelte:head>
    <title>{ $page.params.username } | is the metro accessible?</title>
</svelte:head>

<main class="page-fullscreen">
    <div class="user-profile">
        <img
            class="profile-picture"
            src={ data.avatar }
            alt="Profile picture"
        />
        <h1>{ $page.params.username }</h1>
        <div class="subtitle">
            { reviewCount }
        </div>
        <div class="review-container">
            {#each data.reviews as review}
                <Review review={ review } />
            {/each}
        </div>
        {#if moreReviewsAvailable}
            <Button
                onclick={ incrementPage }
                class="button--filled button--primary"
            >
                Show more
            </Button>
        {/if}
    </div>
</main>