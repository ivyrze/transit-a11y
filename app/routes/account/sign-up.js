import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../../common/prisma/index.js';
import { errorFormatter } from '../../../common/utils.js';

export const router = promiseRouter();

const schema = {
    invite: {
        in: 'body',
        isEmpty: { negated: true }
    },
    email: {
        in: 'body',
        isEmail: true
    },
    username: {
        in: 'body',
        isAlphanumeric: true
    },
    password: {
        in: 'body',
        isLength: { options: { min: 10 } }
    }
};

router.post('/', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    const { invite, email, username, password } = validator.matchedData(req);
    
    // Validate and use one-time invite code
    if (!await prisma.invite.delete({ where: { invite } })) {
        res.json({ errors: { invite: 'Unrecognized invitation code' } }); return;
    }
    
    // Check that email and username aren't already in use
    if (await prisma.user.findUnique({ where: { username } })) {
        res.json({ errors: { username: 'Username is already in use' } }); return;
    } else if (await prisma.user.findUnique({ where: { email } })) {
        res.json({ errors: { email: 'Email is already in use' } }); return;
    }
    
    // Create user object
    const hash = bcrypt.hashSync(password);
    const user = await prisma.user.create({ email, username, password: hash });
    
    // Automatically log the user in
    req.session.user = user.id;
    req.session.save();
    
    res.json({});
});