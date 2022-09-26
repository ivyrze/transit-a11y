import express from 'express';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

export const router = express.Router();

router.post('/', async function(req, res, next) {
    // Check incoming parameters
    if (!req.body.id ||
        req.body.id.split('-').length <= 1) {
        next(new httpErrors.BadRequest()); return;
    }
    
    // Establish database connection
    const client = createClient(redisOptions);
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query and parse output
    let details = await client.hGetAll('stops:' + req.body.id);
    if (Object.keys(details).length) {
        let [ longitude, latitude ] = details.coordinates.split(',');
        details.coordinates = { longitude, latitude };
    }
    
    let tags = await client.sMembers('stops:' + req.body.id + ':tags');
    if (tags.length) { details.tags = tags; }
    
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
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});