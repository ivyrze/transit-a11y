import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';

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
    
    const wildcardQuery = query.trim().split(" ").map(word => "%" + word + "%").join(" ");
    
    let results = await prisma.$queryRaw`
        SELECT id, name FROM "Stop"
        WHERE name ILIKE ${wildcardQuery}
        AND ST_DistanceSphere(
            ST_MakePoint(${longitude},${latitude}),
            ST_MakePoint(coordinates[1], coordinates[2])
        ) < 100000
        LIMIT 10
    `;
    
    results = await prisma.stop.findMany({
        select: {
            id: true,
            name: true,
            routeBranches: {
                select: { branch: {
                    select: { segment: {
                        select: { direction: {
                            select: { route: {
                                select: {
                                    id: true,
                                    number: true,
                                    color: true
                                }
                            } }
                        } }
                    } }
                } }
            }
        },
        where: {
            id: { in: results.map(result => result.id) }
        }
    });
    
    results = results.map(result => {
        result.routes = result.routeBranches.map(({ branch }) => {
            return branch.segment.direction.route;
        });
        delete result.routeBranches;
        
        const routeIds = result.routes.map(route => route.id);
        result.routes = result.routes.filter((route, index) => {
            return !routeIds.includes(route.id, index + 1);
        });
        
        result.routes.sort((a, b) => {
            return a.number.localeCompare(b.number, 'en', { numeric: true });
        });
        
        return result;
    });
    
    res.json({ results });
});