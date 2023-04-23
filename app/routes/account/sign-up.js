import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { User } from '../../models/user.js';
import { Invite } from '../../models/invite.js';
import { errorFormatter, generateUUID } from '../../../utils.js';

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
    if (!await Invite.findOneAndDelete({ invite })) {
        res.json({ errors: { invite: 'Unrecognized invitation code' } }); return;
    }
    
    // Check that email and username aren't already in use
    if (await User.findOne({ username })) {
        res.json({ errors: { username: 'Username is already in use' } }); return;
    } else if (await User.findOne({ email })) {
        res.json({ errors: { email: 'Email is already in use' } }); return;
    }
    
    // Create user object
    const id = generateUUID();
    const created = new Date().toISOString().substring(0, 16) + 'Z';
    
    const user = new User({ _id: id, email, username, password, created, admin: false });
    await user.save();
    
    
    // Automatically log the user in
    req.session.user = id;
    req.session.save();
    
    res.json({});
});