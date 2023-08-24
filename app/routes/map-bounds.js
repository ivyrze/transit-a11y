import express from 'express';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Agency } from '../../common/models/agency.js';

export const router = promiseRouter();

router.post('/', async (req, res, next) => {
    // Get bounding box of requested or default agency
    const query = req.body.agency ?
        { _id: req.body.agency } :
        { default: true };
    
    const bounds = (await Agency.find(query, [ 'bounds' ]).lean())[0]?.bounds;
    
    // Show a not found error for incorrect agency permalinks
    if (!bounds) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json({ bounds });
});