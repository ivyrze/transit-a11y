import express from 'express';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

export const router = express.Router();

router.get('/', async function(req, res, next) {
    // Establish database connection
    const client = createClient(redisOptions);
    client.on('error', error => console.error(error));
    
    try {
        await client.connect();
    } catch {
        next(new httpErrors.InternalServerError()); return;
    }
    
    // Run query
    let alerts = await client.sMembers('alerts');
    client.quit();
    
    // Check outgoing data
    if (alerts == undefined) {
        next(new httpErrors.InternalServerError()); return;
    }
    
    res.json({ alerts });
});