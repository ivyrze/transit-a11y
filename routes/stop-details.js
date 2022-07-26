import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    // Check incoming parameters
    if (!req.body.id) {
        res.status(400).send(); next(); return;
    }
    
    // Establish database connection
    const client = createClient({ url: process.env.REDIS_URL });
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query and parse output
    let details = await client.hGetAll('stops:' + req.body.id);
    let [ longitude, latitude ] = details.coordinates.split(',');
    details.coordinates = { longitude, latitude };
    client.quit();
    
    // Check outgoing data
    if (!details ||
        !details.name ||
        !details.accessibility ||
        !details.coordinates ||
        !details.coordinates.latitude ||
        !details.coordinates.longitude) {
        res.status(404).send(); next(); return;
    }
    
    res.json(details);
});

export { router };