import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { Review } from '../../common/models/review.js';
import { User } from '../../common/models/user.js';
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
    const review = await Review.findById(id);
    if (!review) {
        next(new httpErrors.NotFound()); return;
    }
    
    // Allow reviews to be deleted by their author or by admins
    if (review.author != req.session.user) {
        const { admin } = await User.findById(req.session.user, [ 'admin' ]).lean();
        if (!admin) {
            next(new httpErrors.Unauthorized()); return;
        }
    }
    
    await review.deleteOne();
    
    res.json({});
});