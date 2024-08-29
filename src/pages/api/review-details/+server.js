import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator'; 
import { json, error } from '@sveltejs/kit';

const schema = z.object({
    id: z.string().includes('-')
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
    const { id } = await validate(schema, await request.json());
    
    // Run query and parse output
    const details = await prisma.review.findUnique({
        select: {
            id: true,
            stop: { select: {
                id: true,
                name: true
            } },
            author: { select: {
                username: true,
                avatar: true
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
            comments: true
        },
        where: {
            id
        }
    });
    
    // Check outgoing data
    if (!details) {
        return error(404);
    }
    
    return json(details);
};