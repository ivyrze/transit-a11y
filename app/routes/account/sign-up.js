import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from '../../middleware/validator.js';
import { prisma } from '../../../common/prisma/index.js';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';

const schema = z.object({
    invite: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(10)
});

const router = new Hono();

router.post('/', validator('form', schema), async c => {
    const { invite, email, username, password } = c.req.valid('form');
    
    // Check that email and username aren't already in use
    if (await prisma.user.findUnique({ where: { username } })) {
        c.status(400);
        return c.json({ errors: { username: 'Username is already in use' } });
    } else if (await prisma.user.findUnique({ where: { email } })) {
        c.status(400);
        return c.json({ errors: { email: 'Email is already in use' } });
    }

    // Validate and use one-time invite code
    try {
        await prisma.invite.delete({ where: { invite } });
    } catch {
        c.status(400);
        return c.json({ errors: { invite: 'Unrecognized invitation code' } });
    }
    
    // Create user object
    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: await prisma.user.hashPassword(password)
        }
    });
    
    // Automatically log the user in
    const token = await sign({
        id: user.id
    }, process.env.JWT_SECRET);
    
    setCookie(c, 'token', token, {
        maxAge: 8 * 60**2 * 1000,
        httpOnly: true
    });
    
    return c.json({ username, role: 'LIMITED' });
});

export default router;