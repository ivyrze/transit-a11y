import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    const client = createClient({ url: process.env.REDIS_URL });
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query, treating special characters as an OR operator
    const query = req.body.query.split(/[^\w\d]/g).filter(word => word).join("|");
    let results = await client.ft.search('idx:stops', query + "*");
    client.quit();
    
    results = results.documents.map(result => {
        result.id = result.id.replace('stops:', '');
        return result;
    });
    
    res.json({ results });
});

export { router };