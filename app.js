import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';

import { router as loginRouter } from './routes/account/login.js';
import { router as logoutRouter } from './routes/account/logout.js';
import { router as signUpRouter } from './routes/account/sign-up.js';
import { router as searchRouter } from './routes/api/search.js';
import { router as stopDetailsRouter } from './routes/api/stop-details.js';
import { router as submitReviewRouter } from './routes/api/submit-review.js';
import { router as mapBoundsRouter } from './routes/api/map-bounds.js';
import { router as mapTilesRouter } from './routes/api/map-tiles.js';

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
    proxy: process.env.NODE_ENV === 'production',
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: crypto.randomBytes(64).toString('hex'),
    saveUninitialized: false,
    resave: false
}));

// Setup routes
app.use('/api/search', searchRouter);
app.use('/api/stop-details', stopDetailsRouter);
app.use('/api/submit-review', submitReviewRouter);
app.use('/api/map-bounds', mapBoundsRouter);
app.use('/api/map-tiles', mapTilesRouter);
app.use('/api/account/login', loginRouter);
app.use('/api/account/logout', logoutRouter);
app.use('/api/account/sign-up', signUpRouter);

// Setup production build caching
app.use(express.static('./client/build/', {
    maxAge: 1000 * 60**2 * 24 * 14
}));

app.get('*', (req, res, next) => {
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
    } else {
        next();
    }
});

// API error handling
app.use((error, req, res, next) => {
    res.status(error.status).json({ status: error.status });
});

// Establish database connection
await mongoose.connect(process.env.MONGO_URL);

// Start alert polling and tile indexing
await tiles.start();
alerts.start(10 * 60 * 1000);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});