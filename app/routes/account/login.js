import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from '../../middleware/validator.js';
import { prisma } from '../../../common/prisma/index.js';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';

const schema = z.object({
    username: z.string(),
    password: z.string().min(10)
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { username, password } = c.req.valid('form');
    
    // Get user info to be used in the session object
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            role: true
        },
        where: {
            username
        }
    });
    
    if (!user || !await prisma.user.verifyPassword(username, password)) {
        // User doesn't exist or password doesn't match hash
        c.status(400);
        return c.json({ errors: { password: 'Invalid username or password' } });
    }
    
    // Successfully validated credentials, now create JWT
    const token = await sign({
        id: user.id
    }, process.env.JWT_SECRET);
    
    const tokenLifetime = 8 * 60**2 * 1000;
    const expirationDate = new Date(new Date().getTime() + tokenLifetime);

    setCookie(c, 'token', token, {
        maxAge: tokenLifetime,
        expires: expirationDate,
        httpOnly: true,
        path: '/'
    });
    
    return c.json({ username, role: user.role });
});

export default router;