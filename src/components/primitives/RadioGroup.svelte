<script>
    const { children, ...passthroughProps } = $props();
</script>

<div
    role="radiogroup"
    { ...passthroughProps }
>
    {@render children()}
</div>