import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    username: z.string(),
    page: z.number().gte(1)
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { username, page } = c.req.valid('json');
    
    const reviewsPerPage = 25;
    
    // Run query and parse output
    const details = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            _count: {
                select: { reviews: true }
            },
            reviews: {
                select: {
                    id: true,
                    stop: { select: {
                        id: true,
                        name: true
                    } },
                    accessibility: true,
                    tags: true,
                    timestamp: true,
                    archived: true,
                    attachments: { select: {
                        filename: true,
                        sizes: true,
                        alt: true
                    } },
                    comments: true,
                },
                orderBy: {
                    timestamp: 'desc'
                },
                skip: (page - 1) * reviewsPerPage,
                take: reviewsPerPage
            },
            avatar: true
        },
        where: {
            username
        }
    });
    
    // Add in total number of user's reviews
    details.count = details._count.reviews;
    
    // Check outgoing data
    if (!details) {
        throw new HTTPException(404);
    }
    
    return c.json(details);
});

export default router;