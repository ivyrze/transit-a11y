import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import multer from 'multer';
import * as tiles from './map-tiles.js';
import { prisma } from '../../common/prisma/index.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { errorFormatter, statePrioritySort } from '../../common/utils.js';

export const router = promiseRouter();

const schema = {
    stop: {
        in: 'body',
        contains: { options: '-' }
    },
    'features.bench': {
        in: 'body',
        optional: true
    },
    'features.shelter': {
        in: 'body',
        optional: true
    },
    'features.display': {
        in: 'body',
        optional: true
    },
    'features.heating': {
        in: 'body',
        optional: true
    },
    accessibility: {
        in: 'body',
        toArray: true,
        customSanitizer: { options: value => {
            return value.length ? value : [ 'unknown' ]
        } }
    },
    'accessibility.*': {
        in: 'body',
        isIn: { options: [
            [ ...accessibilityStates.keys() ]
                .filter(state => !state.unreviewable)
        ] }
    },
    comments: {
        in: 'body',
        trim: true,
        optional: { checkFalsy: true }
    },
    'attachmentsAlt': {
        in: 'body',
        optional: true
    }
};

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/', upload.array('attachments', 3), validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    const files = req?.files ?? [];
    
    const validity = await Promise.all(files.map(file => {
        return prisma.reviewAttachment.isValidFormat(file.buffer);
    }));
    
    if (validity.includes(false)) {
        res.status(new httpErrors.BadRequest().status).json({ errors: { attachments: 'Images must be .jpeg or .heic files' }}); return;
    }
    
    if (!req.session.user) {
        next(new httpErrors.Unauthorized()); return;
    }
    
    const { stop, features, accessibility, comments, attachmentsAlt } = validator.matchedData(req);
    
    // Verify that the stop exists
    if (!await prisma.stop.findUnique({ where: { id: stop }})) {
        next(new httpErrors.NotFound()); return;
    }
    
    // User has already made a review for this stop
    const existing = await prisma.review.findFirst({
        select: {
            id: true
        },
        where: {
            AND: {
                stopId: stop,
                authorId: req.session.user
            }
        }
    });
    
    if (existing) {
        await prisma.review.cleanupAndDelete(existing.id);
    }
    
    // Handle review attachments
    const attachments = await Promise.all(files.map(async file => {
        return prisma.reviewAttachment.uploadAndPrepareCreate(
            file.buffer, attachmentsAlt?.[file.originalname]
        );
    }));
    
    // Create review object
    accessibility.sort(statePrioritySort);
    
    await prisma.review.create({
        data: {
            stop: { connect: { id: stop } },
            accessibility,
            ...(features && { tags: Object.keys(features) }),
            author: { connect: { id: req.session.user } },
            ...(attachments.length && { attachments: { create: attachments } }),
            ...(comments && { comments })
        }
    });
    
    const consensus = await prisma.stop.consensus(stop);
    await tiles.invalidateSingle(stop, consensus.accessibility);
    
    res.json({ accessibility: consensus.accessibility });
});