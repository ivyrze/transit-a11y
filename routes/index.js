import express from 'express';

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Is the Metro accessible?',
        accessToken: process.env.MAPBOX_PUBLIC_ACCESS_TOKEN,
        styleUrl: process.env.MAPBOX_STYLE_URL
    });
});

export { router };