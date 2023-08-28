# is the metro accessible?

Explore and search for wheelchair-accessible public transit stops. Reports real-time alerts of barriers like elevator breakdowns.

Currently supports the following agency permalinks:

- Chicago CTA: [`/agency/cta`](https://isthemetroaccessible.com/agency/cta)
- Portland TriMet MAX: [`/agency/trimet`](https://isthemetroaccessible.com/agency/trimet)
- Detroit People Mover: [`/agency/dtc`](https://isthemetroaccessible.com/agency/dtc)
- Detroit QLine: [`/agency/qline`](https://isthemetroaccessible.com/agency/qline)
- Detroit DDOT: [`/agency/ddot`](https://isthemetroaccessible.com/agency/ddot)
- Detroit SMART: [`/agency/smart`](https://isthemetroaccessible.com/agency/smart)

## Initial Setup
Setup your environment variables by referencing `.env.example` or the [wiki documentation](https://github.com/ivyrze/transit-a11y/wiki/Setting-up-environment-variables). Then, install dependencies and seed the database with GTFS data. This may take several minutes.

```
npm install
cp seeder/config.example.json seeder/config.json
npm run start -w seeder
```

## Development

You can run the Express server locally with:

```
npm run develop
```
