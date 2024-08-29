import { prisma } from './index.js';
import { getStatePriority } from '../lib/a11y-states.js';

export const StopVirtuals = {
    agencyId: {
        needs: { id: true },
        compute: stop => {
            return stop.id.split("-")[0];
        }
    }
};

export const StopMethods = {
    consensus: async id => {
        let reviews = (await prisma.stop.findUnique({
            select: {
                reviews: {
                    select: {
                        accessibility: true,
                        tags: true,
                        timestamp: true,
                    },
                    where: {
                        archived: false
                    }
                }
            },
            where: {
                id
            }
        })).reviews;
        let tags = reviews.map(review => review.tags).flat();
        
        // Use state with the biggest consensus or most recent timestamp
        // to determine the overall accessibility
        let states = reviews.reduce((result, current) => {
            current.accessibility.forEach(state => {
                if (state == 'unknown') { return; }
                
                result[state] ??= {
                    count: 0,
                    priority: getStatePriority(state)
                };
                result[state].count++;
                result[state].timestamp = Math.max(
                    new Date(result[state]?.timestamp ?? 0),
                    new Date(current.timestamp)
                );
            });
            
            return result;
        }, {});
        
        states = Object.entries(states);
        states.sort((a, b) => {
            return (b[1].count - a[1].count) ||
                (b[1].timestamp - a[1].timestamp) ||
                (a[1].priority - b[1].priority);
        });
        
        const accessibility = states[0]?.[0] ??
            (reviews.length ? 'auxiliary' : 'unknown');
        
        // Mark any accessibility features that have over 75% consensus
        const frequencies = tags.reduce((result, current) => {
            result[current] = result[current] ? ++result[current] : 1;
            return result;
        }, {});
        
        tags = tags.filter(tag => (frequencies[tag] / reviews.length) >= 0.75);
        tags = [ ...new Set(tags) ];
        
        // Update the stop object with consensus values
        await prisma.accessibility.update({
            data: { reviews: accessibility },
            where: { stopId: id }
        });
        await prisma.stop.update({
            data: { tags },
            where: { id }
        });
        
        return { accessibility, tags };
    }
};