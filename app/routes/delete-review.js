import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';
import * as tiles from './map-tiles.js';

const schema = z.object({
    id: z.string()
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { id } = c.req.valid('json');
    const auth = c.get('jwtPayload');
    
    // Verify that the review exists
    const review = await prisma.review.findUnique({
        select: {
            authorId: true,
            stopId: true,
            attachments: { select: {
                id: true
            } }
        },
        where: {
            id
        }
    });
    
    if (!review) {
        throw new HTTPException(404);
    }
    
    // Allow reviews to be deleted by their author or by admins
    if (review.authorId != auth.id) {
        if (!await prisma.user.hasRole(auth.id, 'ADMIN')) {
            throw new HTTPException(401);
        }
    }
    
    await prisma.review.cleanupAndDelete(id);
    
    const consensus = await prisma.stop.consensus(review.stopId);
    await tiles.invalidateSingle(review.stopId, consensus.accessibility);
    
    return c.json({});
});

export default router;