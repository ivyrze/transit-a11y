import express from 'express';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

export const router = express.Router();

router.get([ '/', '/agency/:agency' ], async function(req, res, next) {
    // Establish database connection
    const client = createClient(redisOptions);
    client.on('error', error => console.error(error));
    
    try {
        await client.connect();
    } catch {
        next(new httpErrors.InternalServerError()); return;
    }
    
    // Get bounding box of requested or default agency
    const agency = req.params.agency ?? await client.hGet('config', 'default');
    let bounds = await client.hGet('agencies:' + agency, 'bounds');
    client.quit();
    
    // Show a not found error for incorrect agency permalinks
    if (!bounds) {
        next(new httpErrors.NotFound()); return;
    }
    
    bounds = bounds.split(',').map(coordinate => parseFloat(coordinate));
    
    res.render('index', {
        title: 'Is the Metro accessible?',
        options: {
            accessToken: process.env.MAPBOX_PUBLIC_ACCESS_TOKEN,
            lightStyleUrl: process.env.MAPBOX_LIGHT_STYLE_URL,
            darkStyleUrl: process.env.MAPBOX_DARK_STYLE_URL,
            mapBounds: bounds
        }
    });
});