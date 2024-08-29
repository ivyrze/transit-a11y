<script>
    import Button from '$components/primitives/Button.svelte';
    import Icon from '$components/primitives/Icon.svelte';
    import { goto } from '$app/navigation';

    const closeCard = () => goto('/');
</script>

<Button
    class="button--rounded"
    aria-label="Close"
    onclick={ closeCard }
>
    <Icon name="close" />
</Button>