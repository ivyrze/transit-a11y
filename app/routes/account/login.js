import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../../common/prisma/index.js';
import { errorFormatter } from '../../../common/utils.js';

export const router = promiseRouter();

const schema = {
    username: {
        in: 'body',
        isAlphanumeric: true
    },
    password: {
        in: 'body',
        isEmpty: { negated: true }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    const { username, password } = validator.matchedData(req);
    
    // Get user info to be used in the session object
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            admin: true
        },
        where: {
            username
        }
    });
    
    if (!user || !await prisma.user.verifyPassword(username, password)) {
        // User doesn't exist or password doesn't match hash
        res.json({ errors: { password: 'Invalid username or password' } }); return;
    }
    
    // Successfully validated credentials, now create session
    req.session.user = user.id;
    req.session.save();
    
    res.json({ username, admin: user.admin });
});