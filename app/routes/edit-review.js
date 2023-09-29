import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';
import * as tiles from './map-tiles.js';
import { accessibilityStates } from '../../common/a11y-states.js';
import { statePrioritySort } from '../../common/utils.js';

const schema = z.object({
    id: z.string().includes('-'),
    accessibility: z.array(z.enum(
        [ ...accessibilityStates.keys() ]
            .filter(state => !state.unreviewable)
    )).default([ 'unknown' ]),
    comments: z.string().trim().optional()
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { id, comments } = c.req.valid('form');
    const { 'accessibility[]': accessibility = [ 'unknown' ] } = await c.req.parseBody();
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
        const { admin } = await prisma.user.findUnique({
            select: {
                admin: true
            },
            where: {
                id: auth.id
            }
        });
        
        if (!admin) {
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
    
    const consensus = await prisma.stop.consensus(review.stopId);
    await tiles.invalidateSingle(review.stopId, consensus.accessibility);
    
    return c.json({});
});

export default router;