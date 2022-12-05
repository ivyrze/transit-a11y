import express from 'express';

export const router = express.Router();

router.get('/', async function(req, res, next) {
    req.session.destroy(error => {
        res.send();
    });
});