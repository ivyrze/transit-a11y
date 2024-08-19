import { Hono } from 'hono';
import { z } from 'zod';
import { validator } from '../middleware/validator.js'; 
import { prisma } from '../../common/prisma/index.js';

const schema = z.object({
    z: z.coerce.number(),
    x: z.coerce.number(),
    y: z.coerce.number()
});

const router = new Hono();

router.get('/:z/:x/:y', validator('param', schema), async c => {
    const { z, x, y } = c.req.valid('param');

    const tile = await prisma.$queryRaw`
        SELECT string_agg(mvt, '') as tile
        FROM (
            (
                SELECT ST_AsMVT(layer.*, 'routes') as mvt
                FROM (
                    SELECT ST_AsMVTGeom(
                        geometry,
                        ST_TileEnvelope(
                            ${ z }::int, ${ x }::int, ${ y }::int
                        )
                    ),
                    name AS route_name,
                    id AS route_id
                    FROM "Route"
                ) layer
            ) UNION (
                SELECT ST_AsMVT(layer.*, 'stops') as mvt
                FROM (
                    SELECT ST_AsMVTGeom(
                        geometry,
                        ST_TileEnvelope(
                            ${ z }::int, ${ x }::int, ${ y }::int
                        )
                    ),
                    name AS stop_name,
                    id AS stop_id,
                    major AS is_major,
                    reviews AS wheelchair_boarding
                    FROM "Stop"
                    INNER JOIN "Accessibility"
                    ON "Accessibility"."stopId" = "Stop".id
                    WHERE major = true
                    OR (major = false AND ${ z >= 11 })
                ) layer
            )
        ) aggregated
    `;

    c.header('Content-Type', 'application/octet-stream');
    return c.body(tile[0].tile);
});

export default router;