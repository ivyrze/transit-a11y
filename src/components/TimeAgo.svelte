<script>
    import { seconds } from '$lib/utils';

    const { class: className, date } = $props();

    const formatter = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto'
    });

    const deltaSeconds = $derived(
        (new Date(date) - new Date()) / 1000
    );
    const temporalDivisor = $derived([
        { unit: 'seconds', amount: 1 },
        { unit: 'minutes', amount: seconds('1m') },
        { unit: 'hours', amount: seconds('1h') },
        { unit: 'days', amount: seconds('1d') },
        { unit: 'weeks', amount: seconds('7d') },
        { unit: 'months', amount: seconds('30d') },
        { unit: 'years', amount: seconds('1y') }
    ].reverse().find(division => {
        return division.amount <= Math.abs(deltaSeconds);
    }));

    const timeAgo = $derived(temporalDivisor ?
        formatter.format(
            Math.round(deltaSeconds / temporalDivisor.amount),
            temporalDivisor.unit
        ) :
        'just now');
</script>

<time
    class={ className }
    datetime={ date }
>
    { timeAgo }
</time>