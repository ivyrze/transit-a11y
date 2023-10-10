import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    query: z.string()
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { query } = c.req.valid('json');
    
    const where = query.trim().split(" ").map(word => ({
        name: {
            contains: word,
            mode: 'insensitive'
        }
    }));
    
    let results = await prisma.stop.findMany({
        select: {
            id: true,
            name: true,
            routeBranches: {
                select: { branch: {
                    select: { segment: {
                        select: { direction: {
                            select: { route: {
                                select: {
                                    id: true,
                                    number: true,
                                    color: true
                                }
                            } }
                        } }
                    } }
                } }
            }
        },
        where: where.length == 1 ? where[0] : {
            AND: where
        },
        take: 10
    });
    
    results = results.map(result => {
        result.routes = result.routeBranches.map(({ branch }) => {
            return branch.segment.direction.route;
        });
        delete result.routeBranches;
        
        const routeIds = result.routes.map(route => route.id);
        result.routes = result.routes.filter((route, index) => {
            return !routeIds.includes(route.id, index + 1);
        });
        
        result.routes.sort((a, b) => a.number - b.number);
        
        return result;
    });
    
    return c.json({ results });
});

export default router;