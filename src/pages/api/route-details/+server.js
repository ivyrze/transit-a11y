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
    let details = await prisma.route.findUnique({
        select: {
            name: true,
            number: true,
            color: true,
            directions: {
                select: {
                    heading: true,
                    segments: {
                        select: { branches: {
                            select: { stops: {
                                select: { stop: {
                                    select: {
                                        id: true,
                                        name: true,
                                        accessibility: { select: {
                                            [perspective]: true
                                        } }
                                    },
                                } },
                                orderBy: {
                                    order: 'asc'
                                }
                            } }
                        } }
                    }
                }
            },
            agencyId: true
        }, where: {
            id
        }
    });
    
    // Make sure that the route exists
    if (!details) {
        return error(404);
    }
    
    details.agency = await prisma.agency.findUnique({
        select: {
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

    details.directions = details.directions.map(direction => {
        direction.segments = direction.segments.map(segment => {
            segment.branches = segment.branches.map(branch => {
                branch.stops = branch.stops.map(({ stop }) => {
                    stop.accessibility = stop.accessibility[perspective];
                    return { stop };
                });
                return branch;
            });
            return segment;
        });
        return direction;
    });
    
    return json(details);
};