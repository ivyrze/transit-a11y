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

You'll need to generate the Prisma database driver and migrate your database schema on initial setup and anytime the schema changes:

```
npm run generate -w common
npm run migrate -w common
```

You can run the stack locally with:

```
npm run develop
```
