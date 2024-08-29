import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator'; 
import { json, error } from '@sveltejs/kit';

const schema = z.object({
    id: z.string().includes('-'),
    perspective: z.enum(
        [ 'reviews', 'agency' ]
    )
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
    const { id, perspective } = await validate(schema, await request.json());
    
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
        // throw new HTTPException(404);
        return error(404);
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
        return error(404);
    }

    details.accessibility = details.accessibility[perspective];
    
    // Use stop-specific URL and fallback to agency-wide URL
    if (details.url) {
        details.agency.url = details.url;
        delete details.url;
    }
    
    return json(details);
};