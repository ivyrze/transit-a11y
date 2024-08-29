<script>
    import '$assets/styles/components/big-radio.scss';

    const { label, description, ...passthroughProps } = $props();
</script>

<label class="big-radio">
    <input
        type="radio"
        { ...passthroughProps }
    />
    <div>
        <div class="big-radio__label">
            { label }
        </div>
        <div class="big-radio__description">
            { description }
        </div>
    </div>
</label>