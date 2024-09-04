import { z } from 'zod';
import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { validate, zCoerceArray } from '$lib/api/validator'; 
import { authenticate } from '$lib/api/auth';
import { accessibilityStates } from '$lib/a11y-states';
import { statePrioritySort } from '$lib/utils';

const schema = z.object({
    stop: z.string().includes('-'),
    features: zCoerceArray(z.enum(
        [ 'bench', 'shelter', 'display', 'heating' ]
    )).optional(),
    accessibility: zCoerceArray(z.enum(
        [ ...accessibilityStates ]
            .filter(state => !state[1].unreviewable)
            .map(state => state[0])
    ), 'unknown'),
    comments: z.string().trim().optional()
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { stop, accessibility, features, comments } =
        await validate(schema, await request.formData());
    const { id } = authenticate(cookies);

    // Verify that the stop exists
    if (!await prisma.stop.findUnique({ where: { id: stop }})) {
        return error(404);
    }

    // Force reviews from limited accounts to not have
    // an accessibility state
    if (await prisma.user.hasRole(id, 'LIMITED')) {
        accessibility.splice(0, accessibility.length);
        accessibility.push('unknown');
    }
    
    // Create review object
    accessibility.sort(statePrioritySort);
    
    const review = await prisma.review.create({
        data: {
            stop: { connect: { id: stop } },
            accessibility,
            ...(features && { tags: features }),
            author: { connect: { id } },
            ...(comments && { comments })
        }
    });
    
    const consensus = await prisma.stop.consensus(stop);
    
    return json({
        id: review.id,
        accessibility: consensus.accessibility
    });
};