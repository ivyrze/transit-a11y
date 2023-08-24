import { Agency } from '../../common/models/agency.js';
import { Stop } from '../../common/models/stop.js';
import { Route } from '../../common/models/route.js';
import { Geometry } from '../../common/models/geometry.js';
import { Review } from '../../common/models/review.js';

export const clean = async () => {
    console.log("Cleaning existing GTFS data...");
    
    await Promise.all([
        Agency.deleteMany(),
        Stop.deleteMany(),
        Route.deleteMany(),
        Geometry.deleteMany()
    ]);
    
    console.log("Cleaning completed successfully.");
};

export const orphans = async (stops) => {
    let reviewed = await Review.find({}).distinct('stop').lean();
    
    return reviewed.filter(key => {
        return !stops.some(stop => key == stop.stop_id);
    });
};