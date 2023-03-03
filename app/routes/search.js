import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { pojoCleanup, colorSort } from '../../utils.js';
import { Stop } from '../models/stop.js'
import { Route } from '../models/route.js'

export const router = promiseRouter();

const schema = {
    query: {
        in: 'body',
        isEmpty: { negated: true }
    },
    longitude: {
        in: 'body',
        isFloat: true,
        toFloat: true
    },
    latitude: {
        in: 'body',
        isFloat: true,
        toFloat: true
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { query, longitude, latitude } = validator.matchedData(req);
    
    let results = await Stop.aggregate([
        {
            $search: {
                compound: {
                    should: [{
                        autocomplete: {
                            query,
                            path: 'name',
                            fuzzy: {
                                maxEdits: 2,
                                prefixLength: 2
                            },
                            score: { boost: { value: 2 } }
                        }
                    },
                    {
                        equals: {
                            path: 'major',
                            value: true,
                            score: { boost: { value: 1 } }
                        }
                    }]
                }
            }
        },
        {
            $match: {
                coordinates: {
                    $geoWithin: {
                        $centerSphere: [
                            [ longitude, latitude ],
                            100 / 3963
                        ]
                    }
                }
            }
        },
        {
            $limit: 10
        },
        {
            $project: {
                _id: true,
                name: true,
                routes: true
            }
        }
    ]);
    
    await Stop.populate(results, {
        path: 'routes',
        select: [
            'name',
            'color',
            'number'
        ],
        options: { lean: true }
    });
    
    results = results.map(result => {
        result.id = result._id;
        result.routes.sort(colorSort);
        result.routes;
        return result;
    });
    
    results = pojoCleanup(results, results, { _id: false });
    
    res.json({ results });
});