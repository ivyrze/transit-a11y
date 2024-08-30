<script>
    const { class: className, date } = $props();

    const formatter = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto'
    });

    const deltaSeconds = (new Date(date) - new Date()) / 1000;
    const temporalDivisor = [
        { unit: 'seconds', amount: 1 },
        { unit: 'minutes', amount: 60 },
        { unit: 'hours', amount: 60**2 },
        { unit: 'days', amount: 60**2 * 24 },
        { unit: 'weeks', amount: 60**2 * 24 * 7 },
        { unit: 'months', amount: 60**2 * 24 * 30 },
        { unit: 'years', amount: 60**2 * 24 * 365 }
    ].reverse().find(division => {
        return division.amount <= Math.abs(deltaSeconds);
    });

    const timeAgo = temporalDivisor ?
        formatter.format(
            Math.round(deltaSeconds / temporalDivisor.amount),
            temporalDivisor.unit
        ) :
        'just now';
</script>

<time
    class={ className }
    datetime={ date }
>
    { timeAgo }
</time>