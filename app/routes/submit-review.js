import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js';
import { prisma } from '../../common/prisma/index.js';
import * as tiles from './map-tiles.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { statePrioritySort } from '../../common/utils.js';

const schema = z.object({
    stop: z.string().includes('-'),
    features: z.array(z.enum(
        [ 'bench', 'shelter', 'display', 'heating' ]
    )).optional(),
    accessibility: z.array(z.enum(
        [ ...accessibilityStates.keys() ]
            .filter(state => !state.unreviewable)
    )).default([ 'unknown' ]),
    comments: z.string().trim().optional(),
    attachmentsAlt: z.array(z.string()).optional()
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { stop, comments, attachmentsAlt } = c.req.valid('form');
    const { 'features[]': features, 'accessibility[]': accessibility = [ 'unknown' ] } = await c.req.parseBody();
    const auth = c.get('jwtPayload');

    const form = await c.req.formData();
    const files = form.getAll('attachments');
    
    const validity = await Promise.all(files.map(async file => {
        return await prisma.reviewAttachment.isValidFormat(await file.arrayBuffer());
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
    const attachments = await Promise.all(files.map(async file => {
        return await prisma.reviewAttachment.uploadAndPrepareCreate(
            await file.arrayBuffer(), attachmentsAlt?.[file.name]
        );
    }));
    
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