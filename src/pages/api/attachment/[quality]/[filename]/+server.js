import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator';
import { error } from '@sveltejs/kit';

const schema = z.object({
    quality: z.enum([ "original", "large", "small" ]),
    filename: z.string().includes('.')
});

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
    const { quality, filename } = await validate(schema, params);
    
    // Proxy image request to S3 bucket
    try {
        const file = await prisma.reviewAttachment.downloadFile(quality, filename);

        return new Response(file.Body.transformToWebStream(), {
            headers: {
                'Content-Type': file.ContentType,
                'Last-Modified': file.LastModified,
                'ETag': file.ETag
            }
        });
    } catch {
        return error(404);
    }
};