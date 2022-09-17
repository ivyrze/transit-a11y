import express from 'express';
import { createClient } from 'redis';
import { redisOptions, colorSort } from '../utils.js';

var router = express.Router();

router.post('/', async function(req, res, next) {
    // Check incoming parameters
    if (!req.body.query ||
        !req.body.longitude ||
        !req.body.latitude) {
        res.status(400).send(); next(); return;
    }
    
    // Establish database connection
    const client = createClient(redisOptions);
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Run query, treating special characters as an OR operator
    const query = req.body.query.split(/[^\w\d]/g).filter(word => word).join("|");
    const geofilter = [ req.body.longitude, req.body.latitude, '100', 'mi' ].join(' ');
    
    let results = await client.ft.search('idx:stops', query + '* ' + ' @coordinates:[' + geofilter + ']');
    
    results = results.documents.map(result => {
        result.id = result.id.replace('stops:', '');
        result.name = result.value.name;
        return result;
    });
    
    // Add route associations
    for await (let result of results) {
        const routes = await client.sMembers('stops:' + result.id + ':routes');
        result.routes = await Promise.all(routes.map(route => {
            return client.hGetAll('routes:' + route);
        }));
        result.routes.sort(colorSort);
    }
    client.quit();
    
    res.json({ results });
});

export { router };