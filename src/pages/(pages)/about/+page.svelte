<script>
    import Link from '$components/primitives/Link.svelte';
    import aboutGraphic from '$assets/images/about-graphic.svg';

    import '$assets/styles/components/about.scss';
</script>

<svelte:head>
    <title>About | is the metro accessible?</title>
</svelte:head>

<main class="page-fullscreen">
    <h1 class="sr-only">About</h1>
    <img src={ aboutGraphic } class="about__graphic" alt="Graphic depicting a yellow gate used by the New York MTA to restrict access to broken elevators" />
    <p class="about__headline">Every day, public transportation connects millions to work, school, and community life. Disabled people are often left behind.</p>
    <p>Decades after the passage of the Americans with Disabilities Act, many <Link href="https://www.nytimes.com/2022/06/22/nyregion/nyc-subway-accessibility-disabilities-elevators.html" class="link--regular">transit agencies are still non-compliant</Link> with it’s standards – standards which, even when implemented, are largely regarded by the disabled community as inadequate. Detroit is no exception, with thousands of bus stops lacking wheelchair-accessible infrastructure. And for riders with limited mobility, just 5% have a safe place to sit.</p>
    <p>These barriers push disabled people to their physical and financial limits, stripping away their well-being. The American Association for People with Disabilities estimates that over 3 million disabled people never leave the home because of <Link href="https://www.aapd.com/transportation/" class="link--regular">transportation difficulties</Link>.</p>
    <p><i>is the metro accessible?</i> is a community-based, open data project tracking transit accessibility. With more accurate and comprehensive information on bus stop conditions, riders are better equipped to make trip planning decisions. It also serves as a tool to hold transit agencies accountable to a tangible, results-oriented framework of ethics and inclusion.</p>
</main>