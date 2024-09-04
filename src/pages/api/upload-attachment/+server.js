import { prisma } from '$database/index';
import { json, error } from '@sveltejs/kit';
import { authenticate } from '$lib/api/auth';
import { handleUpload } from '@vercel/blob/client';
import { seconds } from '$lib/utils';
 
/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, cookies }) => {
    const body = await request.json();

    const pathnameRegex = new RegExp([
        /^original\//,
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})/,
        /\.(\w{4})$/
    ].map(part => part.source).join(''));
 
    try {
        const response = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                const { id: userId } = authenticate(cookies);
                const { id: reviewId } = JSON.parse(clientPayload);

                const review = await prisma.review.findUnique({
                    select: {
                        authorId: true,
                        timestamp: true
                    },
                    where: {
                        id: reviewId
                    }
                });

                if (review.authorId != userId) {
                    return error(401);
                }

                const secondsSinceCreate = (new Date() - review.timestamp) / 1000;
                if (secondsSinceCreate > seconds('5m')) {
                    return error(400);
                }
                
                if (!pathname.match(pathnameRegex)) {
                    return error(400);
                }

                return {
                    allowedContentTypes: Object.values(prisma.reviewAttachment.allowedFormats),
                    tokenPayload: clientPayload,
                    addRandomSuffix: false
                };
            },
            // Not called when running on localhost
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                const original = await fetch(blob.url);
                const buffer = await original.arrayBuffer();

                const { id: reviewId, alt } = JSON.parse(tokenPayload);
                const [ , id, extension ] = blob.pathname.match(pathnameRegex);

                if (!await prisma.reviewAttachment.isValidFormat(buffer, extension)) {
                    await prisma.reviewAttachment.deleteFile('original', id, extension);
                    return error(400);
                }

                const attachment = await prisma.reviewAttachment.uploadAndPrepareCreate(
                    id, buffer, alt
                );

                await prisma.reviewAttachment.create({
                    data: {
                        ...attachment,
                        review: { connect: { id: reviewId } }
                    }
                });
            }
        });
 
        return json(response);
    } catch {
        return error(400);
    }
};