import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator, zCoerceArray } from '../middleware/validator.js';
import { prisma } from '../../common/prisma/index.js';
import * as tiles from './map-tiles.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { statePrioritySort } from '../../common/utils.js';

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
    attachmentsAlt: z.array(z.string()).optional()
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { stop, accessibility, features, comments, attachmentsAlt } = c.req.valid('form');
    const auth = c.get('jwtPayload');

    const form = await c.req.formData();
    const files = await Promise.all(form.getAll('attachments').map(async file => {
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
        c.status(400);
        return c.json({ errors: { attachments: 'Images must be .jpeg or .heic files' }});
    }
    
    // Verify that the stop exists
    if (!await prisma.stop.findUnique({ where: { id: stop }})) {
        throw new HTTPException(404);
    }
    
    // Handle review attachments
    const attachments = await Promise.all(files.map(file => {
        return prisma.reviewAttachment.uploadAndPrepareCreate(file.buffer, file.alt);
    }));

    // Force reviews from limited accounts to not have
    // an accessibility state
    if (await prisma.user.hasRole(auth.id, 'LIMITED')) {
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
            author: { connect: { id: auth.id } },
            ...(attachments.length && { attachments: { create: attachments } }),
            ...(comments && { comments })
        }
    });
    
    const consensus = await prisma.stop.consensus(stop);
    await tiles.invalidateSingle(stop, consensus.accessibility);
    
    return c.json({ accessibility: consensus.accessibility });
});

export default router;