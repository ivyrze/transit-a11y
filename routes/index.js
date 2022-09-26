import express from 'express';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

export const router = express.Router();

router.get([ '/', '/agency/:agency' ], async function(req, res, next) {
    if (req.params.agency) {
        // Establish database connection
        const client = createClient(redisOptions);
        client.on('error', error => console.error(error));
        
        try {
            await client.connect();
        } catch {
            next(new httpErrors.InternalServerError()); return;
        }
        
        var center = await client.hGet('agencies:' + req.params.agency, 'center');
        client.quit();
        
        if (center) {
            center = center.split(',').map(coordinate => parseFloat(coordinate));
        }
    }
    
    res.render('index', {
        title: 'Is the Metro accessible?',
        options: {
            accessToken: process.env.MAPBOX_PUBLIC_ACCESS_TOKEN,
            lightStyleUrl: process.env.MAPBOX_LIGHT_STYLE_URL,
            darkStyleUrl: process.env.MAPBOX_DARK_STYLE_URL,
            ...(center && { mapCenter: center })
        }
    });
});