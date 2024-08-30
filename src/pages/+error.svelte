<script>
    import { page } from '$app/stores';
    import Icon from '$components/primitives/Icon.svelte';

    import '$assets/styles/components/page-layout.scss';

    const description = $derived($page.status >= 500 ?
        "Things aren't working as expected on our end, sorry about that. Try again in a few minutes." :
        "Sorry things aren't working as expected! Try heading back to the homepage.");
</script>

<main class="notice-fullscreen">
    <Icon name="error" />
    <h1>Error { $page.status }</h1>
    <p>{ description }</p>
</main>