import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { cache } from '$lib/api/cache';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
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
        return error(500);
    }
    
    return json({ routes, agencies }, cache('1d', '7d'));
};