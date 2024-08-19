import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator, zCoerceArray } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { statePrioritySort } from '../../common/utils.js';

const schema = z.object({
    id: z.string().includes('-'),
    accessibility: zCoerceArray(z.enum(
        [ ...accessibilityStates ]
            .filter(state => !state[1].unreviewable)
            .map(state => state[0])
    ), 'unknown'),
    comments: z.string().trim().optional()
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { id, accessibility, comments } = c.req.valid('form');
    const auth = c.get('jwtPayload');
    
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
        throw new HTTPException(404);
    }
    
    // Allow reviews to be edited by their author or by admins
    if (review.authorId != auth.id) {
        if (!await prisma.user.hasRole(auth.id, 'ADMIN')) {
            throw new HTTPException(401);
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
    
    return c.json({});
});

export default router;