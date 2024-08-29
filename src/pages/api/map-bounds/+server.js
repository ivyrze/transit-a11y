import { prisma } from '$database/index';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
    // Get bounding box of default agency
    const bounds = (await prisma.agency.findFirst({
        where: {
            default: true
        },
        select: {
            bounds: true
        }
    })).bounds;
    
    return json({ bounds });
};