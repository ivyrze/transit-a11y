import dotenv from 'dotenv';
import express from 'express';
import promiseRouter from 'express-promise-router';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { router as attachmentRouter } from './routes/attachment.js';
import { router as searchRouter } from './routes/search.js';
import { router as stopDetailsRouter } from './routes/stop-details.js';
import { router as routeDetailsRouter } from './routes/route-details.js';
import { router as submitReviewRouter } from './routes/submit-review.js';
import { router as editReviewRouter } from './routes/edit-review.js';
import { router as deleteReviewRouter } from './routes/delete-review.js';
import { router as mapBoundsRouter } from './routes/map-bounds.js';
import { router as mapTilesRouter } from './routes/map-tiles.js';
import { router as profileRouter } from './routes/profile.js';
import { router as checkAuthRouter } from './routes/check-auth.js';
import { router as loginRouter } from './routes/account/login.js';
import { router as logoutRouter } from './routes/account/logout.js';
import { router as signUpRouter } from './routes/account/sign-up.js';

import * as tiles from './routes/map-tiles.js';

import { prisma } from '../common/prisma/index.js';
import { attachExitHandler } from '../common/utils.js';

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
app.use(compression());

if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect('https://' + req.hostname + req.url);
        }
        next();
    });
}

// API error handling
const apiRouter = promiseRouter();
app.use(apiRouter);

apiRouter.use((error, req, res, next) => {
    if (!error.status) {
        // Unexpected error not thrown by input checking
        throw error;
        error.status = 500;
    }
    
    res.status(error.status).json({ status: error.status });
});

// API authentication middleware
apiRouter.use(cookieParser());
apiRouter.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        } catch {
            res.clearCookie('token', { httpOnly: true });
        }
    }
    
    req.user ??= {};
    next();
});

// Setup routes
apiRouter.use('/api/attachment', attachmentRouter);
apiRouter.use('/api/search', searchRouter);
apiRouter.use('/api/stop-details', stopDetailsRouter);
apiRouter.use('/api/route-details', routeDetailsRouter);
apiRouter.use('/api/submit-review', submitReviewRouter);
apiRouter.use('/api/edit-review', editReviewRouter);
apiRouter.use('/api/delete-review', deleteReviewRouter);
apiRouter.use('/api/map-bounds', mapBoundsRouter);
apiRouter.use('/api/map-tiles', mapTilesRouter);
apiRouter.use('/api/check-auth', checkAuthRouter);
apiRouter.use('/api/profile', profileRouter);
apiRouter.use('/api/account/login', loginRouter);
apiRouter.use('/api/account/logout', logoutRouter);
apiRouter.use('/api/account/sign-up', signUpRouter);

// Setup production build caching
const clientRouter = promiseRouter();
app.use(clientRouter);

const buildPath = path.resolve('..', 'client', 'dist');
const indexPath = path.resolve(buildPath, 'index.html');

clientRouter.use(express.static(buildPath, {
    maxAge: '1 year',
    setHeaders: (res, path) => {
        if (path === indexPath) {
            res.setHeader('Cache-Control', 'public, max-age=0');
        }
    }
}));

clientRouter.get('*', (req, res, next) => {
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(indexPath);
    } else {
        next();
    }
});

// Handle database connection on exit
attachExitHandler(() => prisma.$disconnect());

// Start alert polling and tile indexing
await tiles.generate();

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});