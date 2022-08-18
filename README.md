# is the metro accessible?

Explore and search for wheelchair-accessible public transit stops. Reports real-time alerts of barriers like elevator breakdowns.

## Initial Setup
Setup your environment variables by referencing `.env.example` or the [wiki documentation](https://github.com/ivyrze/transit-a11y/wiki/Setting-up-environment-variables). Then, install dependencies and seed the database with GTFS data. This may take several minutes.

```
npm install
cp seeder/config.example.json seeder/config.json
node seeder/seeder.js
```

By default, the seeder script will upload route and stop GeoJSON to Mapbox Tilesets. You can change this behavior with the `--skip-geojson` or `--export-local` flags.

## Development

You can run the Express server locally with:

```
npm run develop
```
