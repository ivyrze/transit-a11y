import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';

const router = new Hono();

router.get('/', async c => {
    deleteCookie(c, 'token', {
        path: '/'
    });
    
    return c.json({});
});

export default router;