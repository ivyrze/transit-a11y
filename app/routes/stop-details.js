import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const router = new Hono();

const schema = z.object({
    id: z.string().includes('-'),
    perspective: z.enum(
        [ 'reviews', 'agency' ]
    )
});

router.post('/', validator('json', schema), async c => {
    const { id, perspective } = c.req.valid('json');
    
    // Run query and parse output
    const details = await prisma.stop.findUnique({
        select: {
            name: true,
            description: true,
            coordinates: true,
            accessibility: { select: {
                [perspective]: true
            } },
            tags: true,
            url: true,
            agencyId: true,
            ...(perspective == "reviews" && {
                reviews: { select: {
                    id: true,
                    accessibility: true,
                    timestamp: true,
                    archived: true,
                    attachments: { select: {
                        filename: true,
                        sizes: true,
                        alt: true
                    } },
                    comments: true,
                    author: { select: {
                        username: true,
                        avatar: true
                    } },
                }, orderBy: {
                    timestamp: 'desc'
                } }
            })
        },
        where: {
            id
        }
    });
    
    // Make sure that the stop exists
    if (!details) {
        throw new HTTPException(404);
    }
    
    let [ longitude, latitude ] = details.coordinates;
    details.coordinates = { longitude, latitude };
    
    details.agency = await prisma.agency.findUnique({
        select: {
            name: true,
            url: true,
            vehicle: true
        },
        where: {
            id: details.agencyId
        }
    });
    delete details.agencyId;
    
    if (!details.agency) {
        throw new HTTPException(404);
    }

    details.accessibility = details.accessibility[perspective];
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    return c.json(details);
});

export default router;