import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';

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
    let details = await prisma.route.findUnique({
        select: {
            name: true,
            number: true,
            color: true,
            directions: {
                select: {
                    heading: true,
                    segments: {
                        select: { branches: {
                            select: { stops: {
                                select: { stop: {
                                    select: {
                                        id: true,
                                        name: true,
                                        accessibility: true
                                    },
                                } },
                                orderBy: {
                                    order: 'asc'
                                }
                            } }
                        } }
                    }
                }
            },
            agencyId: true
        }, where: {
            id
        }
    });
    
    // Make sure that the route exists
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    details.agency = await prisma.agency.findUnique({
        select: {
            vehicle: true
        },
        where: {
            id: details.agencyId
        }
    });
    delete details.agencyId;
    
    if (!details.agency) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});