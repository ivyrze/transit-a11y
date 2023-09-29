import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    id: z.string().includes('-')
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { id } = c.req.valid('json');
    
    // Run query and parse output
    let details = await prisma.route.findUnique({
        select: {
            name: true,
            number: true,
            color: true,
            directions: {
                select: {
                    heading: true,
                    segments: {
                        select: { branches: {
                            select: { stops: {
                                select: { stop: {
                                    select: {
                                        id: true,
                                        name: true,
                                        accessibility: true
                                    },
                                } },
                                orderBy: {
                                    order: 'asc'
                                }
                            } }
                        } }
                    }
                }
            },
            agencyId: true
        }, where: {
            id
        }
    });
    
    // Make sure that the route exists
    if (!details) {
        throw new HTTPException(404);
    }
    
    details.agency = await prisma.agency.findUnique({
        select: {
            vehicle: true
        },
        where: {
            id: details.agencyId
        }
    });
    delete details.agencyId;
    
    if (!details.agency) {
        throw new HTTPException(404);
    }
    
    return c.json(details);
});

export default router;