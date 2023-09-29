import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    query: z.string(),
    longitude: z.coerce.number(),
    latitude: z.coerce.number()
});

const router = new Hono();

router.post('/', validator('json', schema), async c => {
    const { query, longitude, latitude } = c.req.valid('json');
    
    const wildcardQuery = query.trim().split(" ").map(word => "%" + word + "%").join(" ");
    
    let results = await prisma.$queryRaw`
        SELECT id, name FROM "Stop"
        WHERE name ILIKE ${wildcardQuery}
        AND ST_DistanceSphere(
            ST_MakePoint(${longitude},${latitude}),
            ST_MakePoint(coordinates[1], coordinates[2])
        ) < 100000
        LIMIT 10
    `;
    
    results = await prisma.stop.findMany({
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
        where: {
            id: { in: results.map(result => result.id) }
        }
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
        
        result.routes.sort((a, b) => {
            return a.number.localeCompare(b.number, 'en', { numeric: true });
        });
        
        return result;
    });
    
    return c.json({ results });
});

export default router;