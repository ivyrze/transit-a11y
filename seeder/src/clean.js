import { prisma } from '../../common/prisma/index.js';

export const clean = async (agencies, stops, routes) => {
    const replacedAgencies = agencies.map(agency => agency.agency_id);
    const replacedStops = stops.map(stop => stop.stop_id);
    const replacedRoutes = routes.map(route => route.route_id);
    
    const whereClause = ids => ({
        where: { NOT: { id: { in: ids } } }
    });
    
    return [
        prisma.geometry.deleteMany(),
        prisma.routeDirectionStop.deleteMany(),
        prisma.routeDirectionBranch.deleteMany(),
        prisma.routeDirectionSegment.deleteMany(),
        prisma.routeDirection.deleteMany(),
        prisma.route.deleteMany(whereClause(replacedRoutes)),
        prisma.stop.deleteMany(whereClause(replacedStops)),
        prisma.agency.deleteMany(whereClause(replacedAgencies))
    ];
};

export const orphans = async (stops) => {
    const reviewed = await prisma.review.findMany({
        select: {
            stopId: true
        }
    });
    
    return reviewed.map(review => review.stopId).filter(review => {
        return !stops.some(stop => review == stop.stop_id);
    });
};