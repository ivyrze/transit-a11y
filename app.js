import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import crypto from 'crypto';

import { createClient } from 'redis';
import { redisOptions } from './utils.js';

import { router as indexRouter } from './routes/index.js';
import { router as loginRouter } from './routes/account/login.js';
import { router as logoutRouter } from './routes/account/logout.js';
import { router as signUpRouter } from './routes/account/sign-up.js';
import { router as searchRouter } from './routes/api/search.js';
import { router as stopDetailsRouter } from './routes/api/stop-details.js';
import { router as submitReviewRouter } from './routes/api/submit-review.js';
import { router as mapTilesRouter } from './routes/api/map-tiles.js';

import { errorMiddleware, notFoundMiddleware } from './routes/error.js';

import * as alerts from './alerts/index.js';
import * as tiles from './routes/api/map-tiles.js';

dotenv.config();

export const app = express();

// Setup development utilities
app.use(morgan('dev'));

app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.hidePoweredBy());
app.use(helmet.referrerPolicy());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60**2 * 10
    },
    secret: crypto.randomBytes(64).toString('hex'),
    saveUninitialized: false,
    resave: false
}));

// Setup view engine
app.set('views', 'views');
app.set('view engine', 'pug');

// Setup static assets and caching
[ 'css', 'fonts', 'img', 'js' ].forEach(dir => {
    app.use('/' + dir, express.static('public/' + dir,
        (dir == 'fonts') ? { maxAge: 1000 * 60**2 * 24 * 7 } : {}));
});

// Setup routes
app.use('/', indexRouter);
app.use('/account/login', loginRouter);
app.use('/account/logout', logoutRouter);
app.use('/account/sign-up', signUpRouter);
app.use('/api/search', searchRouter);
app.use('/api/stop-details', stopDetailsRouter);
app.use('/api/submit-review', submitReviewRouter);
app.use('/api/map-tiles', mapTilesRouter);

// Custom error page
app.use(errorMiddleware);
app.use(notFoundMiddleware);

// Establish database connection
const client = createClient(redisOptions);
client.on('error', error => console.error(error));

await client.connect();
app.locals.client = client;

// Start alert polling and tile indexing
await tiles.start(client);
alerts.start(client, 10 * 60 * 1000);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});