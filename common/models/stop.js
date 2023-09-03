import mongoose from 'mongoose';
import { AlertSchema } from './alert.js';
import { pojoCleanup } from '../../common/utils.js';
import { getStatePriority } from '../a11y-states.js';

const StopSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    coordinates: [Number],
    major: Boolean,
    accessibility: String,
    alert: AlertSchema,
    tags: [String],
    url: String
}, {
    id: false,
    versionKey: false,
    toObject: {
        transform: pojoCleanup
    }
});

StopSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'stop'
});

StopSchema.index({ coordinates: '2dsphere' });

StopSchema.method({
    getAgencyKey() {
        return this._id.split('-').slice(0, -1).join('-');
    },
    async consensus() {
        await this.populate('reviews');
        
        let reviews = this.reviews.map(review => review.toObject());
        let tags = reviews.map(review => review.tags).flat();
        
        // Use state with the biggest consensus or most recent timestamp
        // to determine the overall accessibility
        let states = reviews.reduce((result, current) => {
            current.accessibility.forEach(state => {
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
        
        const accessibility = states[0]?.[0] ?? 'unknown';
        
        // Mark any accessibility features that have over 75% consensus
        const frequencies = tags.reduce((result, current) => {
            result[current] = result[current] ? ++result[current] : 1;
            return result;
        }, {});
        
        tags = tags.filter(tag => (frequencies[tag] / reviews.length) >= 0.75);
        tags = [ ...new Set(tags) ];
        
        // Update the stop object with consensus values
        const newValues = { accessibility, tags };
        await this.updateOne(newValues);
        
        return newValues;
    }
});

export const Stop = mongoose.model('Stop', StopSchema);