import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Review } from '../models/review.js';
import { errorFormatter } from '../../utils.js';

export const router = promiseRouter();

const schema = {
    id: {
        in: 'body',
    },
    accessibility: {
        in: 'body',
        isIn: { options: [[
            'unknown',
            'accessible',
            'construction',
            'other-temporary',
            'parking',
            'limited-maneuverability',
            'poor-conditions',
            'other-complicated',
            'missing-landing',
            'insufficient-dimensions',
            'insufficient-curb',
            'uneven-surface',
            'missing-paths',
            'obstacles',
            'other-inaccessible'
        ]] }
    },
    comments: {
        in: 'body',
        trim: true,
        optional: { checkFalsy: true }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    const { id, accessibility, comments } = validator.matchedData(req);
    
    // Verify that the review exists
    let review = await Review.findById(id);
    if (!review) {
        next(new httpErrors.NotFound()); return;
    }
    
    // Verify editing permissions
    if (!req.session.user || review.author !== req.session.user) {
        next(new httpErrors.Unauthorized()); return;
    }
    
    // Apply requested changes
    Object.assign(review, { accessibility, comments });
    await review.save();
    
    res.json({});
});