import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator'; 
import { json, error } from '@sveltejs/kit';

const schema = z.object({
    username: z.string(),
    page: z.number().gte(1)
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
    const { username, page } = await validate(schema, await request.json());
    
    const reviewsPerPage = 25;
    
    // Run query and parse output
    const details = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            _count: {
                select: { reviews: true }
            },
            reviews: {
                select: {
                    id: true,
                    stop: { select: {
                        id: true,
                        name: true
                    } },
                    accessibility: true,
                    tags: true,
                    timestamp: true,
                    archived: true,
                    attachments: { select: {
                        filename: true,
                        sizes: true,
                        alt: true
                    } },
                    comments: true,
                },
                orderBy: {
                    timestamp: 'desc'
                },
                skip: (page - 1) * reviewsPerPage,
                take: reviewsPerPage
            },
            avatar: true
        },
        where: {
            username
        }
    });
    
    // Add in total number of user's reviews
    details.count = details._count.reviews;
    
    // Check outgoing data
    if (!details) {
        return error(404);
    }
    
    return json(details);
};