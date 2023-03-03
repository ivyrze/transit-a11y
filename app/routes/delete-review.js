import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Review } from '../models/review.js';
import { errorFormatter } from '../../utils.js';

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
    
    // Do the deletion, if its matches the logged in user
    const review = await Review.findById(id, [
        'author',
        'stop'
    ]);
    
    if (review.author != req.session.user) {
        next(new httpErrors.Unauthorized()); return;
    }
    
    await review.deleteOne();
    
    res.json({});
});