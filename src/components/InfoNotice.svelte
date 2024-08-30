<script>
    import Icon from '$components/primitives/Icon.svelte';
    
    import '$assets/styles/components/info-notice.scss';

    const { iconName = 'warning', children } = $props();
</script>

<p class="info-notice">
    <Icon name={ iconName } />
    {@render children()}
</p>