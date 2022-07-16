import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { router as indexRouter } from './routes/index.js';
import { router as searchRouter } from './routes/search.js';

dotenv.config();

const app = express();

// Setup development utilities
app.use(morgan('dev'));
app.use(helmet.hidePoweredBy());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup view engine
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.static('public'));

// Setup routes
app.use('/', indexRouter);
app.use('/api/search', searchRouter);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});

export { app };