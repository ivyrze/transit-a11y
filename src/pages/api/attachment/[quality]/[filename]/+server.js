import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator';
import { error } from '@sveltejs/kit';

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
        return file;
    } catch {
        return error(404);
    }
};