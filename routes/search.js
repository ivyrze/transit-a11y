import express from 'express';
import { createClient } from 'redis';

var router = express.Router();

router.post('/', async function(req, res, next) {
    const client = createClient({ url: process.env.REDIS_URL });
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query, treating special characters as an OR operator
    const query = req.body.query.split(/[^\w\d]/g).filter(word => word).join("|");
    let raw = await client.sendCommand([
        'FT.SEARCH', 'idx:stops',
        query + '*',
        'GEOFILTER', 'coordinates',
        req.body.longitude, req.body.latitude,
        '100', 'mi'
    ]);
    client.quit();
    
    // Reorganize raw Redis results
    const count = raw.shift();
    
    let results = [];
    for (let i = 0; i < count * 2; i++) {
        // Move id inside of property arrays
        results.push([ 'id', raw[i] ].concat(raw[++i]));
    }
    results = results.map(result => {
        // Transform from flat array to key-value object
        let entries = {};
        for (let i = 0; i < result.length; i += 2) {
            entries[result[i]] = result[i + 1];
        }
        return entries;
    });
    
    results = results.map(result => {
        result.id = result.id.replace('stops:', '');
        delete result.coordinates;
        delete result.accessibility;
        return result;
    });
    
    res.json({ results });
});

export { router };