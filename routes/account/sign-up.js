import bcrypt from 'bcryptjs';
import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import { errorFormatter, generateUUID } from '../../utils.js';

export const router = express.Router();

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

router.get('/', async function(req, res, next) {
    res.render('account/sign-up', { title: 'Sign up' });
});

router.post('/', validator.checkSchema(schema), async function(req, res, next) {
    // Check incoming parameters
    const errors = validator.validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(new httpErrors.BadRequest().status).json({ errors: errors.mapped() }); return;
    }
    
    const client = req.app.locals.client;
    const { invite, email, username, password } = validator.matchedData(req);
    
    // Validate invite code
    if (!await client.sIsMember('invites', invite)) {
        res.json({ errors: { invite: 'Unrecognized invitation code' } }); return;
    }
    
    // Check that email and username aren't already in use
    if ((await client.ft.search('idx:users', '@username:{' + username + '}')).total) {
        res.json({ errors: { username: 'Username is already in use' } }); return;
    }
    
    const escaped = email.replace(/[^\w\d]/gi, "\\$&");
    if ((await client.ft.search('idx:users', '@email:{' + escaped + '}')).total) {
        res.json({ errors: { email: 'Email is already in use' } }); return;
    }
    
    // Create user object
    const id = generateUUID();
    const hash = bcrypt.hashSync(password);
    const created = new Date().toISOString().substring(0, 16) + 'Z';
    
    await client.sAdd('users', id);
    await client.hSet('users:' + id, { email, username, password: hash, created });
    
    // Remove invite code from available pool
    await client.sRem('invites', invite);
    
    // Automatically log the user in
    req.session.user = id;
    req.session.save();
    
    res.json({});
});