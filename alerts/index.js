import { createClient } from 'redis';
import { clean } from './clean.js';

import * as cta from './agencies/chicago-cta.js';

const start = interval => {
    setInterval(tick, interval);
    setTimeout(tick, 1000);
};

const tick = () => {
    console.log("Checking alerts APIs...");
    
    // Call database update after all agency alerts are retrieved
    Promise.all([ cta ].map(agency => agency.status())).then(update);
};

const update = async agencies => {
    // Establish database connection
    const client = createClient({ url: process.env.REDIS_URL });
    
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    
    // Remove all existing alerts
    await clean(client);
    
    // Import new alerts
    agencies.forEach(alerts => {
        for (const stop in alerts) {
            client.sAdd('alerts', stop);
            Object.keys(alerts[stop]).forEach(prop => {
                client.hSet('alerts:' + stop, prop, alerts[stop][prop]);
            });
        }
    });
    
    console.log("Stored alerts for " + agencies.length + " agencies.");
    
    client.quit();
};

export { start };