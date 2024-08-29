<script>
    import Link from '$components/primitives/Link.svelte';

    import "$assets/styles/components/author-link.scss";

    const { author } = $props();
</script>

<div class="author-link">
    <img
        class="profile-picture"
        src={ author.avatar }
        alt="Profile picture"
    />
    <Link
        href={ "/profile/" + author.username }
        class="link--minimal"
    >
        { author.username }
    </Link>
</div>