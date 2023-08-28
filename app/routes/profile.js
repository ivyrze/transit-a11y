import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { User } from '../../common/models/user.js';
import { Review } from '../../common/models/review.js';
import { pojoCleanup } from '../../common/utils.js';

export const router = promiseRouter();

const schema = {
    username: {
        in: 'body'
    },
    page: {
        in: 'body',
        isInt: { options: {
            min: 1
        } }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { username, page } = validator.matchedData(req);
    
    const reviewsPerPage = 25;
    
    // Run query and parse output
    let details = await User.findOne({ username }, [
        '_id',
        'email',
        'reviews'
    ]).populate({ path: 'reviews', select: [
        '_id',
        'accessibility',
        'tags',
        'timestamp',
        'attachments',
        'comments'
    ],
    skip: (page - 1) * reviewsPerPage,
    limit: reviewsPerPage,
    options: { sort: { timestamp: -1 } },
    populate: { path: 'stop', select: [
        '_id',
        'name'
    ] } });
    
    // Make sure that the user exists
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    // Convert from database objects and remove unnecessary fields
    details = details.toObject({
        virtuals: [ 'reviews', 'avatar', 'filename' ]
    });
    
    delete details.email;
    details.reviews = details.reviews.map(review => {
        review.id = review._id;
        review.stop.id = review.stop._id;
        delete review._id;
        delete review.stop._id;
        delete review.author;
        
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
    
    // Add in total number of user's reviews
    details.count = await Review.countDocuments({ author: details._id });
    
    details = pojoCleanup(details, details, { _id: false });
    
    // Check outgoing data
    if (!details) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});