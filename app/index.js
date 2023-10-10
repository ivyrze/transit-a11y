import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { compress } from 'hono/compress';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { jwt } from './middleware/jwt.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

import routes from './routes.js';
import * as tiles from './routes/map-tiles.js';

dotenv.config({ path: '../.env' });
global.crypto ??= crypto;

const app = new Hono();

// Attach middlewares
app.use('*', compress());
app.use('*', logger());
app.use('*', secureHeaders());

// Setup routes
for (const path in routes) {
    if (routes[path].auth) {
        // Authentication middleware opt-in per-route
        app.use(path, jwt({
            required: routes[path]?.auth === 'required'
        }));
    }

    app.route(path, routes[path].router);
}

// Start map tile indexing
await tiles.generate();

// Start server
serve({
    fetch: app.fetch,
    port: process.env.PORT || 3001,
    ...(process.env.NODE_ENV !== "production" && {
        hostname: "localhost" 
    })
});
console.log("Server started.");