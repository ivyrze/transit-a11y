import express from 'express';
import httpErrors from 'http-errors';
import { Agency } from '../models/agency.js';

export const router = express.Router();

router.get([ '/', '/agency/:agency' ], async function(req, res, next) {
    // Get bounding box of requested or default agency
    const query = req.params.agency ?
        { _id: req.params.agency } :
        { default: true };
    
    const bounds = (await Agency.find(query, [ 'bounds' ]).lean())[0]?.bounds;
    
    // Show a not found error for incorrect agency permalinks
    if (!bounds) {
        next(new httpErrors.NotFound()); return;
    }
    
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