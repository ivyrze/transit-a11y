import { z } from 'zod';
import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { validate } from '$lib/api/validator'; 
import { authenticate } from '$lib/api/auth';

const schema = z.object({
    id: z.string()
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { id } = await validate(schema, await request.json());
    const { id: userId } = authenticate(cookies);
    
    // Verify that the review exists
    const review = await prisma.review.findUnique({
        select: {
            archived: true,
            authorId: true,
            stopId: true,
        },
        where: {
            id
        }
    });
    
    if (!review) {
        return error(404);
    }
    
    // Allow reviews to be archived by their author or by admins
    if (review.authorId != userId) {
        if (!await prisma.user.hasRole(userId, 'ADMIN')) {
            return error(401);
        }
    }
    
    // Toggle the archived field
    await prisma.review.update({
        data: {
            archived: !review.archived
        },
        where: {
            id
        }
    });
    
    await prisma.stop.consensus(review.stopId);
    
    return json({});
};