<script>
    import clsx from 'clsx';
    
    import '$assets/styles/components/route-icon.scss';

    const { number, color, inverted } = $props();
</script>

<div
    class={ clsx(
        "route-icon", { inverted }
    ) }
    style:color={ inverted && color }
    style:background-color={ !inverted && color }
>
    { number }
</div>