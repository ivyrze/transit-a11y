import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.optional(
    z.object({
        agency: z.string()
    })
);

const router = new Hono();

router.post('/', async c => {
    // Get bounding box of requested or default agency
    const query = c.req.valid('json')?.agency ?
        { id: c.req.valid('json').agency } :
        { default: true };
    
    const bounds = (await prisma.agency.findFirst({
        where: query,
        select: {
            bounds: true
        }
    }))?.bounds;
    
    // Show a not found error for incorrect agency permalinks
    if (!bounds) {
        throw new HTTPException(404);
    }
    
    return c.json({ bounds });
});

export default router;