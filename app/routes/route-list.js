import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { prisma } from '../../common/prisma/index.js';

const router = new Hono();

router.get('/', async c => {
    const routes = await prisma.route.findMany({
        select: {
            id: true,
            name: true,
            number: true,
            color: true
        },
        orderBy: {
            number: 'asc'
        }
    });

    const agencies = await prisma.agency.findMany({
        select: {
            id: true,
            name: true,
            default: true
        },
        orderBy: {
            name: 'asc'
        }
    });
    
    // Make sure that the routes exist
    if (!routes?.length) {
        throw new HTTPException(500);
    }
    
    return c.json({ routes, agencies });
});

export default router;