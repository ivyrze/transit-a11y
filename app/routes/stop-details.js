import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Stop } from '../../common/models/stop.js';
import { Agency } from '../../common/models/agency.js';
import { Review } from '../../common/models/review.js';
import { pojoCleanup } from '../../common/utils.js';

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
    let details = await Stop.findById(id, [
        'name',
        'description',
        'coordinates',
        'accessibility',
        'alert',
        'tags',
        'url'
    ]).populate({ path: 'reviews', select: [
        '_id',
        'accessibility',
        'timestamp',
        'author',
        'attachments',
        'comments'
    ], populate: { path: 'author', select: [
        'username',
        'email'
    ] } });
    
    // Make sure that the stop exists
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    const key = details.getAgencyKey();
    details = details.toObject({
        virtuals: [ 'reviews', 'avatar', 'filename' ]
    });
    
    details.reviews = details.reviews.map(review => {
        review.id = review._id;
        delete review._id;
        return review;
    });
    
    details = pojoCleanup(details, details, { _id: false });
    
    let [ longitude, latitude ] = details.coordinates;
    details.coordinates = { longitude, latitude };
    
    if (details.alert) {
        details.accessibility = 'service-alert';
    }
    
    details.agency = await Agency.findById(key, [
        '-_id',
        'name',
        'url',
        'vehicle',
        'reviews'
    ]).lean();
    
    if (!details.agency) {
        next(new httpErrors.NotFound()); return;
    }
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    if (details.agency.reviews === true) {
        // Cleanup from Gravatar and attachment virtuals
        details.reviews = details.reviews.map(review => {
            delete review.author.email;
            if (review.attachments?.length) {
                review.attachments = review.attachments.map(attachment => ({
                    filename: attachment.filename,
                    sizes: attachment.sizes
                }));
            } else {
                delete review.attachments;
            }
            
            return review;
        });
        
        // Sort by review submission date
        details.reviews.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    } else {
        delete details.reviews;
    }
    delete details.agency.reviews;
    
    res.json(details);
});