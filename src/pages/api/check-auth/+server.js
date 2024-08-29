import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { authenticate } from '$lib/api/auth';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ cookies }) => {
    const { id } = authenticate(cookies, false);
    if (!id) {
        return json({});
    }
    
    const user = await prisma.user.findUnique({
        select: {
            username: true,
            role: true
        },
        where: {
            id
        }
    });
    
    if (!user) {
        return error(401);
    }
    
    return json({ username: user.username, role: user.role });
};