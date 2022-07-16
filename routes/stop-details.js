import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    const client = createClient(process.env.REDIS_CONNECTION_URL);
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    let details = await client.hGetAll('stops:' + req.body.id);
    const coordinates = await client.geoPos('stops-geospatial', req.body.id);
    Object.assign(details, { coordinates: coordinates[0] });
    
    if (!details ||
        !details.name ||
        !details.accessibility ||
        !details.coordinates ||
        !details.coordinates.latitude ||
        !details.coordinates.longitude) {
        res.status(404); next(); return;
    }
    
    res.json(details);
});

export { router };