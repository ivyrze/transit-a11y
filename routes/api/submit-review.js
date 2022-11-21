import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
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
    
    const client = req.app.locals.client;
    const { stop, features, accessibility, comments } = validator.matchedData(req);
    
    // Verify that the stop exists
    if (!await client.sIsMember('stops', stop)) {
        next(new httpErrors.NotFound()); return;
    }
    
    // User has already made a review for this stop
    const existing = await client.hGet('stops:' + stop + ':reviews', req.session.user);
    if (existing) {
        // Remove existing review
        await client.sRem('reviews', existing);
        await client.del([
            'reviews:' + existing,
            'reviews:' + existing + ':tags'
        ]);
        await client.hDel('stops:' + stop + ':reviews', req.session.user);
        await client.sRem('users:' + req.session.user + ':reviews', existing);
    }
    
    // Create review object
    const id = generateUUID();
    const timestamp = new Date().toISOString().substring(0, 16) + 'Z';
    
    await client.sAdd('reviews', id);
    await client.hSet('reviews:' + id, { accessibility, timestamp, ...(comments && { comments }) });
    
    if (features) {
        await client.sAdd('reviews:' + id + ':tags', Object.keys(features));
    }
    
    await client.hSet('stops:' + stop + ':reviews', req.session.user, id);
    await client.sAdd('users:' + req.session.user + ':reviews', id);
    
    res.json({});
});