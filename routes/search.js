import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    const client = createClient(process.env.REDIS_CONNECTION_URL);
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Treat special characters as an OR operator
    const query = req.body.query.split(/[^\w\d]/g).filter(word => word).join("|");
    
    const results = await client.ft.search('idx:stops', query + "*");
    res.json({ results: results.documents });
});

export { router };