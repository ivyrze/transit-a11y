import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';

export const router = express.Router();

const schema = {
    id: {
        in: 'body',
        contains: { options: '-' }
    }
};

router.post('/', validator.checkSchema(schema), async function(req, res, next) {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const client = req.app.locals.client;
    const { id } = validator.matchedData(req);
    
    // Run query and parse output
    let details = await client.hGetAll('stops:' + id);
    if (Object.keys(details).length) {
        let [ longitude, latitude ] = details.coordinates.split(',');
        details.coordinates = { longitude, latitude };
    }
    
    let tags = await client.sMembers('stops:' + id + ':tags');
    if (tags.length) { details.tags = tags; }
    
    let alert = await client.hGetAll('alerts:' + id);
    if (Object.keys(alert).length) { details.alert = alert; }
    
    const key = id.split('-').slice(0, -1).join('-');
    details.agency = await client.hGetAll('agencies:' + key);
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    // Check outgoing data
    if (!details ||
        !details.name ||
        !details.accessibility ||
        !details.coordinates ||
        !details.coordinates.latitude ||
        !details.coordinates.longitude ||
        !details.agency ||
        !details.agency.name ||
        !details.agency.url) {
        next(new httpErrors.NotFound()); return;
    }
    
    res.json(details);
});