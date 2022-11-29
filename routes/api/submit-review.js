import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import { Review } from '../../models/review.js';
import { Stop } from '../../models/stop.js';
import { errorFormatter, generateUUID } from '../../utils.js';

export const router = express.Router();

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
        isIn: { options: [[
            'accessible',
            'parking',
            'other-sometimes',
            'construction',
            'obstacles-temporary',
            'other-temporary',
            'limited-maneuverability',
            'poor-conditions',
            'other-complicated',
            'missing-landing',
            'uneven-surface',
            'lacks-curb',
            'obstacles-permanent',
            'other-inaccessible'
        ]] }
    },
    comments: {
        in: 'body',
        trim: true,
        optional: { checkFalsy: true }
    }
};

router.post('/', validator.checkSchema(schema), async function(req, res, next) {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
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
        ...(comments && { comments })
    });
    await review.save();
    
    res.json({});
});