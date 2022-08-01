import express from 'express';

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Is the Metro accessible?',
        accessToken: process.env.MAPBOX_PUBLIC_ACCESS_TOKEN,
        lightStyleUrl: process.env.MAPBOX_LIGHT_STYLE_URL,
        darkStyleUrl: process.env.MAPBOX_DARK_STYLE_URL
    });
});

export { router };