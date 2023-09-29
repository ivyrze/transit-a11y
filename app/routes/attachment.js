import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    quality: z.enum([ "original", "large", "small" ]),
    filename: z.string().includes('.')
});

const router = new Hono();

router.get('/:quality/:filename', validator('param', schema), async c => {
    const { quality, filename } = c.req.valid('param');
    
    // Proxy image request to S3 bucket
    try {
        const file = await prisma.reviewAttachment.downloadFile(quality, filename);

        return c.stream(async stream => {
            await stream.pipe(file.Body.transformToWebStream());
        });
    } catch {
        throw new HTTPException(404);
    }
});

export default router;