import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import gravatar from 'gravatar';

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
    if (Object.keys(alert).length) {
        details.accessibility = 'service-alert';
        details.alert = alert;
    }
    
    const key = id.split('-').slice(0, -1).join('-');
    details.agency = await client.hGetAll('agencies:' + key);
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    if (details.agency.reviews === 'true') {
        // Get list of reviews and more details about the authors
        let reviews = await client.hGetAll('stops:' + id + ':reviews');
        let users = Object.keys(reviews);
        reviews = Object.values(reviews);
        
        reviews = await Promise.all(reviews.map(review => {
            return client.hGetAll('reviews:' + review);
        }));
        users = await Promise.all(users.map(user => {
            return client.hGetAll('users:' + user);
        }));
        
        // Add Gravatar and remove unnecessary data
        const gravatarOptions = { size: 100, protocol: 'https', default: 'mp' };
        users = users.map(user => ({
            username: user.username,
            avatar: gravatar.url(user.email, gravatarOptions)
        }));
        
        // Merge user data into unified object
        reviews.forEach((review, index) => { review.author = users[index]; });
        
        // Sort by review submission date
        reviews.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        details.reviews = reviews;
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