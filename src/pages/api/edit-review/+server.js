import { z } from 'zod';
import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { validate, zCoerceArray } from '$lib/api/validator'; 
import { authenticate } from '$lib/api/auth';
import { accessibilityStates } from '$lib/a11y-states';
import { statePrioritySort } from '$lib/utils';

const schema = z.object({
    id: z.string().includes('-'),
    accessibility: zCoerceArray(z.enum(
        [ ...accessibilityStates ]
            .filter(state => !state[1].unreviewable)
            .map(state => state[0])
    ), 'unknown'),
    comments: z.string().trim().optional()
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { id, accessibility, comments } =
        await validate(schema, await request.formData());
    const { id: userId } = authenticate(cookies);
    
    // Verify that the review exists
    const review = await prisma.review.findUnique({
        select: {
            authorId: true,
            stopId: true
        },
        where: {
            id
        }
    });
    
    if (!review) {
        return error(404);
    }
    
    // Allow reviews to be edited by their author or by admins
    if (review.authorId != userId) {
        if (!await prisma.user.hasRole(userId, 'ADMIN')) {
            return error(401);
        }
    }
    
    // Apply requested changes
    accessibility.sort(statePrioritySort);
    
    await prisma.review.update({
        data: {
            accessibility,
            comments
        },
        where: {
            id
        }
    });
    
    await prisma.stop.consensus(review.stopId);
    
    return json({});
};