import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import multer from 'multer';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Review } from '../../common/models/review.js';
import { Stop } from '../../common/models/stop.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { errorFormatter, generateUUID } from '../../common/utils.js';

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
    if (!await Stop.findById(stop)) {
        next(new httpErrors.NotFound()); return;
    }
    
    // User has already made a review for this stop
    await Review.findOneAndDelete({ stop, author: req.session.user });
    
    // Handle review attachments
    const attachments = await Promise.all((req.files ?? []).map(async file => {
        const id = generateUUID();
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
            _id: id,
            type: file.mimetype,
            sizes
        };
    }));
    
    // Create review object
    const id = generateUUID();
    const timestamp = new Date().toISOString().substring(0, 16) + 'Z';
    
    const review = new Review({
        _id: id,
        stop: stop,
        accessibility,
        ...(features && { tags: Object.keys(features) }),
        timestamp,
        author: req.session.user,
        ...(attachments && { attachments }),
        ...(comments && { comments })
    });
    await review.save();
    
    res.json({ accessibility: review.stop.accessibility });
});