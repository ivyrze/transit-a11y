import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import { Stop } from '../models/stop.js';
import { Agency } from '../models/agency.js';
import { Review } from '../models/review.js';

export const router = express.Router();

const schema = {
    id: {
        in: 'body',
        contains: { options: '-' }
    }
};

router.post('/', validator.checkSchema(schema), async function(req, res, next) {
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
        'accessibility',
        'tags',
        'timestamp',
        'author',
        'comments'
    ], populate: { path: 'author', select: [
        'username',
        'email'
    ] } });
    
    const key = details.getAgencyKey();
    details = details.toObject({
        virtuals: [ 'reviews', 'avatar' ],
        _id: false
    });
    
    if (Object.keys(details).length) {
        let [ longitude, latitude ] = details.coordinates;
        details.coordinates = { longitude, latitude };
    }
    
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
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    if (details.agency.reviews === true) {
        // Cleanup from Gravatar virtual
        details.reviews = details.reviews.map(review => {
            delete review.author.email;
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
    
    // Check outgoing data
    if (!details ||
        !details.name ||
        !details.accessibility ||
        !details.coordinates ||
        !details.coordinates.latitude ||
        !details.coordinates.longitude ||
        !details.agency ||
        !details.agency.name ||
        !details.agency.url) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});