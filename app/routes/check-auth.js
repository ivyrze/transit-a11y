import express from 'express';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';

export const router = promiseRouter();

router.get('/', async (req, res, next) => {
    if (!req.user.id) {
        res.json({}); return;
    }
    
    const user = await prisma.user.findUnique({
        select: {
            username: true,
            admin: true
        },
        where: {
            id: req.user.id
        }
    });
    
    if (!user) {
        next(new httpErrors.InternalServerError()); return;
    }
    
    res.json({ username: user.username, admin: user.admin });
});