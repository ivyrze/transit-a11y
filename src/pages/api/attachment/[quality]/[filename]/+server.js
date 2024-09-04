import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator';
import { error } from '@sveltejs/kit';
import { cache } from '$lib/api/cache';

const schema = z.object({
    quality: z.enum([ "large", "small" ]),
    filename: z.string().includes('.')
});

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
    const { quality, filename } = await validate(schema, params);
    
    // Proxy image request to storage bucket
    try {
        const file = await prisma.reviewAttachment.downloadFile(quality, filename);
        return new Response(file.body, {
            headers: {
                ...file.headers,
                ...cache('30d', '1y', true).headers
            }
        });
    } catch {
        return error(404);
    }
};