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
    comments: z.string().trim().optional(),
    attachments: zCoerceArray(z.instanceof(File)).optional(),
    attachmentsAlt: z.record(z.string(), z.string()).optional()
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { stop, accessibility, features, comments, attachments = [], attachmentsAlt } =
        await validate(schema, await request.formData());
    const { id } = authenticate(cookies);

    const files = await Promise.all(attachments.map(async file => {
        // Array buffer conversion required by legacy sharp version
        return {
            buffer: Buffer.from(await file.arrayBuffer()),
            alt: attachmentsAlt?.[file.name]
        };
    }));
    
    const validity = await Promise.all(files.map(file => {
        return prisma.reviewAttachment.isValidFormat(file.buffer);
    }));
    
    if (validity.includes(false)) {
        return error(400, { errors: { attachments: 'Images must be .jpeg files' }});
    }
    
    // Verify that the stop exists
    if (!await prisma.stop.findUnique({ where: { id: stop }})) {
        return error(404);
    }
    
    // Handle review attachments
    const attachmentData = await Promise.all(files.map(file => {
        return prisma.reviewAttachment.uploadAndPrepareCreate(file.buffer, file.alt);
    }));

    // Force reviews from limited accounts to not have
    // an accessibility state
    if (await prisma.user.hasRole(id, 'LIMITED')) {
        accessibility.splice(0, accessibility.length);
        accessibility.push('unknown');
    }
    
    // Create review object
    accessibility.sort(statePrioritySort);
    
    await prisma.review.create({
        data: {
            stop: { connect: { id: stop } },
            accessibility,
            ...(features && { tags: features }),
            author: { connect: { id } },
            ...(attachments.length && { attachments: { create: attachmentData } }),
            ...(comments && { comments })
        }
    });
    
    const consensus = await prisma.stop.consensus(stop);
    
    return json({ accessibility: consensus.accessibility });
};