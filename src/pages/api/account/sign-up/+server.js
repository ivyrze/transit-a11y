import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator'; 
import { json, error } from '@sveltejs/kit';
import { createSession } from '$lib/api/auth';

const schema = z.object({
    invite: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(10)
});

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const { invite, email, username, password } =
        await validate(schema, await request.formData());
    
    // Check that email and username aren't already in use
    if (await prisma.user.findUnique({ where: { username } })) {
        return error(400, { errors: { username: 'Username is already in use' } });
    } else if (await prisma.user.findUnique({ where: { email } })) {
        return error(400, { errors: { email: 'Email is already in use' } });
    }

    // Validate and use one-time invite code
    try {
        await prisma.invite.delete({ where: { invite } });
    } catch {
        return error(400, { errors: { invite: 'Unrecognized invitation code' } });
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
    createSession(cookies, { id: user.id });
    
    return json({ username, role: 'LIMITED' });
};