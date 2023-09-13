# is the metro accessible?

Explore and search for wheelchair-accessible public transit stops.

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
