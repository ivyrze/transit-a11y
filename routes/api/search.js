import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { redisOptions, colorSort } from '../../utils.js';

export const router = express.Router();

const schema = {
    query: {
        in: 'body',
        isEmpty: { negated: true }
    },
    longitude: {
        in: 'body',
        isFloat: true
    },
    latitude: {
        in: 'body',
        isFloat: true
    }
};

router.post('/', validator.checkSchema(schema), async function(req, res, next) {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { query, longitude, latitude } = validator.matchedData(req);
    
    // Establish database connection
    const client = createClient(redisOptions);
    client.on('error', error => console.error(error));
    
    try {
        await client.connect();
    } catch {
        next(new httpErrors.InternalServerError()); return;
    }
    
    // Run query, treating special characters as an OR operator
    const searchable = query.split(/[^\w\d]/g).filter(word => word).join("|");
    const geofilter = [ longitude, latitude, '100', 'mi' ].join(' ');
    
    let results = await client.ft.search('idx:stops', searchable + '* ' + ' @coordinates:[' + geofilter + ']');
    
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