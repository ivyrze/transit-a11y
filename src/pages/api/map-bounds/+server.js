import { prisma } from '$database/index';
import { json } from '@sveltejs/kit';
import { cache } from '$lib/api/cache';

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

    const expansionX =
        (bounds[2] - bounds[0]) * 0.1;
    const expansionY =
        (bounds[3] - bounds[1]) * 0.1;
    bounds[0] -= expansionX;
    bounds[1] -= expansionY;
    bounds[2] += expansionX;
    bounds[3] += expansionY;
    
    return json({ bounds }, cache('1d', '14d'));
};