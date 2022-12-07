import express from 'express';
import httpErrors from 'http-errors';
import { User } from '../models/user.js';

export const router = express.Router();

router.get('/', async function(req, res, next) {
    if (!req.session.user) {
        res.json({}); return;
    }
    
    const user = await User.findById(req.session.user, [
        'username'
    ]);
    
    if (!user) {
        next(new httpErrors.InternalServerError()); return;
    }
    
    res.json({ username: user.username });
});