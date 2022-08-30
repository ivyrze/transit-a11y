import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    // Check incoming parameters
    if (!req.body.id ||
        req.body.id.split('-').length <= 1) {
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
    
    let alert = await client.hGetAll('alerts:' + req.body.id);
    if (Object.keys(alert).length) { details.alert = alert; }
    
    const key = req.body.id.split('-').slice(0, -1).join('-');
    details.agency = await client.hGetAll('agencies:' + key);
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    client.quit();
    
    // Check outgoing data
    if (!details ||
        !details.name ||
        !details.accessibility ||
        !details.coordinates ||
        !details.coordinates.latitude ||
        !details.coordinates.longitude ||
        !details.agency ||
        !details.agency.name ||
        !details.agency.url) {
        res.status(404).send(); next(); return;
    }
    
    res.json(details);
});

export { router };