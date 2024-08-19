import turfDistance from '@turf/distance';

export const link = datasets => {
    let links = {};
    for (let i = 0; i < datasets.length - 1; i++) {
        for (let j = i + 1; j < datasets.length; j++) {
            // Only link agencies with the same vehicle type
            if (datasets[i].agency.agency_vehicle != datasets[j].agency.agency_vehicle) {
                continue;
            }
            
            const newLinks = findNearest(datasets[i].stops, datasets[j].stops);
            
            // Combine with existing links
            for (const parent in newLinks) {
                links[parent] = links[parent] ?
                    links[parent].concat(newLinks[parent]) :
                    [ newLinks[parent] ];
            }
        }
    }
    
    // Temporarily use key-value organization
    let stops = {}, routes = {};
    datasets.forEach(dataset => {
        dataset.stops.forEach(stop => stops[stop.stop_id] = stop);
        dataset.routes.forEach(route => routes[route.route_id] = route);
    });
    
    // Merge into stop objects alongside appendix data
    for (const link in links) {
        if (stops[link].linked_with === undefined) {
            stops[link].linked_with = links[link];
        }
    }
    
    // Collapse children stops into parents recursively
    for (const stop in stops) {
        if (stops[stop].linked_with) {
            [ stops, routes ] = collapseStops(stops, routes, stop);
        }
    }
    
    // Revert back to original grouping
    datasets = datasets.map(dataset => {
        const prefix = dataset.routes[0].route_id.split('-')[0];
        dataset.stops = Object.values(stops).filter(stop => {
            return stop.stop_id.startsWith(prefix + '-');
        });
        dataset.routes = Object.values(routes).filter(route => {
            return route.route_id.startsWith(prefix + '-');
        });
        
        return dataset;
    });
    
    return datasets;
};

const collapseStops = (stops, routes, parent) => {
    stops[parent].linked_with.forEach(child => {
        if (!stops[child]) {
            console.warn("Import warning: Weak linked stop reference in '" + parent + "' to child '" + child + "'.");
            return;
        }
        
        if (stops[child].linked_with?.length) {
            [ stops, routes ] = collapseStops(stops, routes, child);
        }
        
        routes = updateStopReference(routes, child, parent);
        
        // Remove child stops to prevent storage
        delete stops[child];
    });
    
    // Prevent recursion over a child more than once
    delete stops[parent].linked_with;
    
    return [ stops, routes ];
};

const updateStopReference = (routes, from, to) => {
    for (let route in routes) {
        routes[route].route_directions = routes[route].route_directions.map(direction => {
            direction.segments = direction.segments.map(segment => {
                segment.branches = segment.branches.map(branch => {
                    branch.stops = branch.stops.map(stop => {
                        if (stop == from) {
                            return to;
                        }
                        
                        return stop;
                    });
                    return branch;
                });
                return segment;
            });
            return direction;
        });
    }
    
    return routes;
};

const findNearest = (setA, setB) => {
    let links = {};
    for (const a of setA) {
        const nearest = setB.reduce((result, current) => {
            // Don't link stops that are far away
            const distance = stopDistance(a, current);
            if (distance >= 30) { return result; }
            
            // Don't link stops that have already been linked
            // during this comparison set
            if (Object.values(links).includes(current.stop_id)) {
                return result;
            }
            
            // Without a comparator, distance can't be computed
            if (!result) { return current; }
            
            return (stopDistance(a, result) < distance) ? result : current;
        }, false);
        
        if (nearest) {
            links[a.stop_id] = nearest.stop_id;
        }
    }
    
    return links;
};

const stopDistance = (a, b) => {
    return turfDistance(
        [ a.stop_lon, a.stop_lat ],
        [ b.stop_lon, b.stop_lat ],
        { units: 'kilometers' }
    ) * 1000;
};