# is the metro accessible?

Explore and search for wheelchair-accessible public transit stops. Reports real-time alerts of barriers like elevator breakdowns.

## Initial Setup

Paste your Redis connection string and [Mapbox access token](https://account.mapbox.com/access-tokens/) into your `.env` file. Be sure your token has the `tilesets:write` scope.

Install dependencies and seed the database with GTFS data. This may take several minutes.

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
