<script>
    import { inject } from '@vercel/analytics';
    import { dev } from '$app/environment';

    import "$assets/styles/style.scss";

    const { children } = $props();

    inject({ mode: dev ? 'development' : 'production' });
</script>

{@render children()}
