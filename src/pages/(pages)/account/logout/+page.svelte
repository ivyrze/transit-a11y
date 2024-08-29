<script>
    import Icon from '$components/primitives/Icon.svelte';
    import Link from '$components/primitives/Link.svelte';
</script>

<svelte:head>
    <title>Logout | is the metro accessible?</title>
</svelte:head>

<main class="notice-fullscreen">
    <Icon name="login" />
    <h1>Logged out</h1>
    <p>You've successfully been logged out. Would you like to <Link href="/" class="link--regular">return home</Link> or <Link href="/account/login" class="link--regular">log back in</Link>?</p>
</main>