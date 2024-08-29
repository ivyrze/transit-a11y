import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator'; 
import { json, error } from '@sveltejs/kit';
import { createSession } from '$lib/api/auth';

const schema = z.object({
    username: z.string(),
    password: z.string().min(10)
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { username, password } = await validate(schema, await request.formData());
    
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
        return error(400, { errors: { password: 'Invalid username or password' } });
    }
    
    // Successfully validated credentials, now create JWT
    createSession(cookies, { id: user.id });
    
    return json({ username, role: user.role });
};