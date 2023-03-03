import express from 'express';
import promiseRouter from 'express-promise-router';

export const router = promiseRouter();

router.get('/', async (req, res, next) => {
    req.session.destroy(error => {
        res.send();
    });
});