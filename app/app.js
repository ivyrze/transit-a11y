import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import promiseRouter from 'express-promise-router';
import mongoStore from 'connect-mongo';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';

import { router as attachmentRouter } from './routes/attachment.js';
import { router as searchRouter } from './routes/search.js';
import { router as stopDetailsRouter } from './routes/stop-details.js';
import { router as routeDetailsRouter } from './routes/route-details.js';
import { router as submitReviewRouter } from './routes/submit-review.js';
import { router as deleteReviewRouter } from './routes/delete-review.js';
import { router as mapBoundsRouter } from './routes/map-bounds.js';
import { router as mapTilesRouter } from './routes/map-tiles.js';
import { router as profileRouter } from './routes/profile.js';
import { router as checkAuthRouter } from './routes/check-auth.js';
import { router as loginRouter } from './routes/account/login.js';
import { router as logoutRouter } from './routes/account/logout.js';
import { router as signUpRouter } from './routes/account/sign-up.js';

import * as alerts from './alerts/index.js';
import * as tiles from './routes/map-tiles.js';

import { attachExitHandler } from '../utils.js';

dotenv.config({ path: '../.env' });

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
    proxy: process.env.NODE_ENV === 'production',
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        touchAfter: 1000 * 60 * 30
    }),
    secret: crypto.randomBytes(64).toString('hex'),
    saveUninitialized: false,
    resave: false
}));

// Setup routes
const router = promiseRouter();
app.use(router);

router.use('/api/attachment', attachmentRouter);
router.use('/api/search', searchRouter);
router.use('/api/stop-details', stopDetailsRouter);
router.use('/api/route-details', routeDetailsRouter);
router.use('/api/delete-review', deleteReviewRouter);
router.use('/api/submit-review', submitReviewRouter);
router.use('/api/map-bounds', mapBoundsRouter);
router.use('/api/map-tiles', mapTilesRouter);
router.use('/api/check-auth', checkAuthRouter);
router.use('/api/profile', profileRouter);
router.use('/api/account/login', loginRouter);
router.use('/api/account/logout', logoutRouter);
router.use('/api/account/sign-up', signUpRouter);

// Setup production build caching
router.use(express.static('./client/build/', {
    maxAge: 1000 * 60**2 * 24 * 14
}));

router.get('*', (req, res, next) => {
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
    } else {
        next();
    }
});

// API error handling
router.use((error, req, res, next) => {
    if (!error.status) {
        // Unexpected error not thrown by input checking
        throw error;
        error.status = 500;
    }
    
    res.status(error.status).json({ status: error.status });
});

// Establish database connection
await mongoose.connect(process.env.MONGO_URL);
attachExitHandler(() => mongoose.disconnect());

// Start alert polling and tile indexing
await tiles.start();
alerts.start(10 * 60 * 1000);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});