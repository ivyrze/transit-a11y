import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    id: z.string().includes('-')
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { id } = c.req.valid('json');
    
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
        throw new HTTPException(404);
    }
    
    return c.json(details);
});

export default router;