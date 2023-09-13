import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import * as tiles from './map-tiles.js';
import { prisma } from '../../common/prisma/index.js';
import { errorFormatter } from '../../common/utils.js';

export const router = promiseRouter();

const schema = {
    id: {
        in: 'body'
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    if (!req.session.user) {
        next(new httpErrors.Unauthorized()); return;
    }
    
    const { id } = validator.matchedData(req);
    
    // Verify that the review exists
    const review = await prisma.review.findUnique({
        select: {
            authorId: true,
            stopId: true,
            attachments: { select: {
                id: true
            } }
        },
        where: {
            id
        }
    });
    
    if (!review) {
        next(new httpErrors.NotFound()); return;
    }
    
    // Allow reviews to be deleted by their author or by admins
    if (review.authorId != req.session.user) {
        const { admin } = await prisma.user.findUnique({
            select: {
                admin: true
            },
            where: {
                id: req.session.user
            }
        });
        
        if (!admin) {
            next(new httpErrors.Unauthorized()); return;
        }
    }
    
    await prisma.review.cleanupAndDelete(id);
    
    const consensus = await prisma.stop.consensus(review.stopId);
    await tiles.invalidateSingle(review.stopId, consensus.accessibility);
    
    res.json({});
});