import express from 'express';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { User } from '../models/user.js';

export const router = promiseRouter();

router.get('/', async (req, res, next) => {
    if (!req.session.user) {
        res.json({}); return;
    }
    
    const user = await User.findById(req.session.user, [
        'username',
        'admin'
    ]);
    
    if (!user) {
        next(new httpErrors.InternalServerError()); return;
    }
    
    res.json({ username: user.username, admin: user.admin });
});