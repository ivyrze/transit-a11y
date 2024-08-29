import { z } from 'zod';
import { prisma } from '$database/index';
import { validate } from '$lib/api/validator';

const schema = z.object({
    perspective: z.enum(
        [ 'reviews', 'agency' ]
    ),
    z: z.coerce.number(),
    x: z.coerce.number(),
    y: z.coerce.number()
});

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
    const { perspective, z, x, y } = await validate(schema, params);

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
                    CASE
                        WHEN ${ perspective == "reviews" } THEN reviews
                        WHEN ${ perspective == "agency" } THEN agency
                    END as wheelchair_boarding
                    FROM "Stop"
                    INNER JOIN "Accessibility"
                    ON "Accessibility"."stopId" = "Stop".id
                    WHERE major = true
                    OR (major = false AND ${ z >= 11 })
                ) layer
            )
        ) aggregated
    `;

    return new Response(tile[0].tile, {
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    });
};