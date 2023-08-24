import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Route } from '../../common/models/route.js';
import { Stop } from '../../common/models/stop.js';
import { Agency } from '../../common/models/agency.js';

export const router = promiseRouter();

const schema = {
    id: {
        in: 'body',
        contains: { options: '-' }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { id } = validator.matchedData(req);
    
    // Run query and parse output
    let details = await Route.findById(id, [
        'name',
        'number',
        'color',
        'directions'
    ]);
    
    // Make sure that the route exists
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    const key = details.getAgencyKey();
    details = details.toObject({ _id: false });
    
    // Manually populate directions
    details.directions = await Promise.all(details.directions.map(async direction => {
        direction.segments = await Promise.all(direction.segments.map(segment => {
            return Promise.all(segment.map(async branch => {
                let stops = await Stop.find(
                    { "_id": { $in: branch } },
                    [ 'name', 'accessibility' ]
                ).lean();
                
                stops = stops.map(stop => {
                    stop.id = stop._id;
                    delete stop._id;
                    return stop;
                });
                
                return branch.map(id => {
                    return stops.find(stop => stop.id == id) ?? -1;
                });
            }));
        }));
        return direction;
    }));
    
    details.agency = await Agency.findById(key, [
        '-_id',
        'vehicle'
    ]).lean();
    
    if (!details.agency) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});