import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { router as indexRouter } from './routes/index.js';
import { router as searchRouter } from './routes/api/search.js';
import { router as stopDetailsRouter } from './routes/api/stop-details.js';
import { router as mapTilesRouter } from './routes/api/map-tiles.js';

import { errorMiddleware, notFoundMiddleware } from './routes/error.js';

import * as alerts from './alerts/index.js';

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
app.use('/api/search', searchRouter);
app.use('/api/stop-details', stopDetailsRouter);
app.use('/api/map-tiles', mapTilesRouter);

// Custom error page
app.use(errorMiddleware);
app.use(notFoundMiddleware);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});

// Start alert polling
alerts.start(10 * 60 * 1000);