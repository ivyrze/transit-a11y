<script>
    import RadioGroup from '$components/primitives/RadioGroup.svelte';
    import BigRadio from '$components/BigRadio.svelte';
    import CardClose from '$components/CardClose.svelte';
    import { perspectiveStore } from '$lib/stores.svelte';

    import '$assets/styles/components/perspective-switcher.scss';

    const onChange = event => {
        perspectiveStore.perspective = event.target.value;
    };
</script>

<svelte:head>
    <title>Perspectives | is the metro accessible?</title>
</svelte:head>

<main class="sidebar-card">
    <div class="card__header">
        <h1 class="card__alt-heading">Switch perspectives</h1>
        <div class="card__actions">
            <CardClose />
        </div>
    </div>
    <div class="perspective-switcher">
        <RadioGroup>
            <BigRadio
                name="perspective"
                value="reviews"
                label="User reviews"
                description="Data uploaded directly to the site by fellow users"
                checked={ perspectiveStore.perspective == "reviews" }
                onchange={ onChange }
            />
            <BigRadio
                name="perspective"
                value="agency"
                label="Transit agency"
                description="Data published by the agency through a public dataset"
                checked={ perspectiveStore.perspective == "agency" }
                onchange={ onChange }
            />
        </RadioGroup>
    </div>
</main>