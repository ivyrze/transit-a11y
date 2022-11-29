import sanity from '@sanity/client';
import { sanityOptions } from '../utils.js';
import { Stop } from '../models/stop.js';

import * as cta from './agencies/chicago-cta.js';
import * as trimet from './agencies/portland-trimet.js';

export const start = interval => {
    setInterval(tick, interval);
    setTimeout(tick, 20 * 1000);
};

const tick = async () => {
    console.log("Checking alerts APIs...");
    
    // Call database update after all agency alerts are retrieved
    const agencies = await Promise.all([ cta, trimet ].map(agency => {
        return agency.status(synonyms).catch(error => console.error(error));
    }));
    
    update(agencies);
};

const update = async agencies => {
    // Remove failed promise results
    agencies = agencies.filter(agency => agency);
    
    // Remove all existing alerts
    await clean();
    
    // Import new alerts
    agencies.forEach(async alerts => {
        for (const stop in alerts) {
            await Stop.updateOne({ _id: stop }, { alert: alerts[stop] });
        }
    });
    
    console.log("Stored alerts for " + agencies.length + " agencies.");
};

const extend = async () => {
    console.log("Caching Sanity Studio stop synonyms...");
    
    const client = sanity(sanityOptions);
    return await client.fetch('*[_type=="stop" && synonyms != null]{"agency": agency->id, id, synonyms}');
};

const synonyms = await extend();

const clean = () => {
    return Stop.updateMany({ alert: { $ne: null } }, { alert: null });
};