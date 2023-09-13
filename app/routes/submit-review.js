import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
    }
};

const upload = multer({
    storage: multer.memoryStorage()
});
const client = new S3Client();

const proxies = [
    {
        quality: 'original'
    },
    {
        quality: 'small',
        height: 250
    },
    {
        quality: 'large',
        height: 2000
    }
]

router.post('/', upload.array('attachments', 3), validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    if (req.files?.some(file => file.mimetype != "image/jpeg")) {
        res.status(new httpErrors.BadRequest().status).json({ errors: { attachments: 'Images must be .jpg files' }}); return;
    }
    
    if (!req.session.user) {
        next(new httpErrors.Unauthorized()); return;
    }
    
    const { stop, features, accessibility, comments } = validator.matchedData(req);
    
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
    const attachments = await Promise.all((req.files ?? []).map(async file => {
        const id = randomUUID();
        
        const sizes = await Promise.all(proxies.map(async proxy => {
            // Create resized proxy file, factoring in EXIF rotation
            let image = (proxy.quality != 'original') ?
                await sharp(file.buffer)
                    .rotate()
                    .resize({
                        height: proxy.height,
                        fit: 'inside'
                    })
                    .toBuffer({
                        quality: 85,
                        progressive: true,
                        resolveWithObject: false
                    }) :
                file.buffer;
            
            // Upload proxy file
            const command = new PutObjectCommand({
                Key: proxy.quality + '/' + id + '.' + file.mimetype.split('/')[1],
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: image
            });
            await client.send(command);
            
            // Prepare database object
            const metadata = await sharp(image).metadata();
            
            return {
                quality: proxy.quality,
                width: metadata.width,
                height: metadata.height
            };
        }));
        
        return {
            id, type: file.mimetype, sizes
        };
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