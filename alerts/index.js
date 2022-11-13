import sanity from '@sanity/client';
import { sanityOptions, cleanKeyPattern } from '../utils.js';

import * as cta from './agencies/chicago-cta.js';
import * as trimet from './agencies/portland-trimet.js';

export const start = (client, interval) => {
    setInterval(tick, interval, client);
    setTimeout(tick, 20 * 1000, client);
};

const tick = async client => {
    console.log("Checking alerts APIs...");
    
    // Call database update after all agency alerts are retrieved
    const agencies = await Promise.all([ cta, trimet ].map(agency => {
        return agency.status(client, synonyms).catch(error => console.error(error));
    }));
    
    update(client, agencies);
};

const update = async (client, agencies) => {
    // Remove failed promise results
    agencies = agencies.filter(agency => agency);
    
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
    
    await client.publish('geometry:updates', 'stops');
    
    console.log("Stored alerts for " + agencies.length + " agencies.");
};

const extend = async () => {
    console.log("Caching Sanity Studio stop synonyms...");
    
    const client = sanity(sanityOptions);
    return await client.fetch('*[_type=="stop" && synonyms != null]{"agency": agency->id, id, synonyms}');
};

const synonyms = await extend();

const clean = client => {
    return Promise.all([
        client.del("alerts"),
        cleanKeyPattern(client, "alerts:*")
    ]);
};