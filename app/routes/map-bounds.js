import { Hono } from 'hono';
import { prisma } from '../../common/prisma/index.js';

const router = new Hono();

router.get('/', async c => {
    // Get bounding box of default agency
    const bounds = (await prisma.agency.findFirst({
        where: {
            default: true
        },
        select: {
            bounds: true
        }
    })).bounds;
    
    return c.json({ bounds });
});

export default router;