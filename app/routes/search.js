import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { pojoCleanup } from '../../common/utils.js';
import { Stop } from '../../common/models/stop.js'
import { Route } from '../../common/models/route.js'

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
                name: true
            }
        }
    ]);
    
    let routes = await Route.find({
        'directions.segments': {
            '$elemMatch': {
                '$elemMatch': {
                    '$elemMatch': {
                        '$in': results.map(result => result._id)
                    }
                }
            }
        }
    }, [
        'number',
        'color',
        'directions'
    ]).lean();
    
    routes = routes.map(route => {
        route.directions = route.directions.map(direction => direction.segments).flat(3);
        return route;
    });
    
    results = results.map(result => {
        result.id = result._id;
        
        result.routes = routes.filter(route => route.directions.includes(result.id));
        result.routes.sort((a, b) => {
            return a.number.localeCompare(b.number, 'en', { numeric: true });
        });
        
        return result;
    });
    
    results = results.map(result => {
        result.routes = result.routes.map(route => {
            delete route.directions;
            return route;
        });
        return result;
    })
    
    results = pojoCleanup(results, results, { _id: false });
    
    res.json({ results });
});