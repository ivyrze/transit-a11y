import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.get('/', async function(req, res, next) {
    // Establish database connection
    const client = createClient({ url: process.env.REDIS_URL });
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query
    let alerts = await client.sMembers('alerts');
    client.quit();
    
    // Check outgoing data
    if (alerts == undefined) {
        res.status(500).send(); next(); return;
    }
    
    res.json({ alerts });
});

export { router };