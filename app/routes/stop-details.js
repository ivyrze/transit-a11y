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
    const details = await prisma.stop.findUnique({
        select: {
            name: true,
            description: true,
            coordinates: true,
            accessibility: true,
            tags: true,
            url: true,
            agencyId: true,
            reviews: { select: {
                id: true,
                accessibility: true,
                timestamp: true,
                archived: true,
                attachments: { select: {
                    filename: true,
                    sizes: true,
                    alt: true
                } },
                comments: true,
                author: { select: {
                    username: true,
                    avatar: true
                } },
            }, orderBy: {
                timestamp: 'desc'
            } }
        },
        where: {
            id
        }
    });
    
    // Make sure that the stop exists
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    let [ longitude, latitude ] = details.coordinates;
    details.coordinates = { longitude, latitude };
    
    details.agency = await prisma.agency.findUnique({
        select: {
            name: true,
            url: true,
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
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    res.json(details);
});