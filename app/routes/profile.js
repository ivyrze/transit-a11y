import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';

export const router = promiseRouter();

const schema = {
    username: {
        in: 'body'
    },
    page: {
        in: 'body',
        isInt: { options: {
            min: 1
        } }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { username, page } = validator.matchedData(req);
    
    const reviewsPerPage = 25;
    
    // Run query and parse output
    const details = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            _count: {
                select: { reviews: true }
            },
            reviews: {
                select: {
                    id: true,
                    stop: { select: {
                        id: true,
                        name: true
                    } },
                    accessibility: true,
                    tags: true,
                    timestamp: true,
                    attachments: { select: {
                        filename: true,
                        sizes: true
                    } },
                    comments: true,
                },
                orderBy: {
                    timestamp: 'desc'
                },
                skip: (page - 1) * reviewsPerPage,
                take: reviewsPerPage
            },
            avatar: true
        },
        where: {
            username
        }
    });
    
    // Add in total number of user's reviews
    details.count = details._count.reviews;
    
    // Check outgoing data
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});