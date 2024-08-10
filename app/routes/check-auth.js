import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { prisma } from '../../common/prisma/index.js';

const router = new Hono();

router.get('/', async c => {
    const auth = c.get('jwtPayload');
    if (!auth?.id) {
        return c.json({});
    }
    
    const user = await prisma.user.findUnique({
        select: {
            username: true,
            role: true
        },
        where: {
            id: auth.id
        }
    });
    
    if (!user) {
        throw new HTTPException(500);
    }
    
    return c.json({ username: user.username, role: user.role });
});

export default router;