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
        let states = reviews.map(review => review.accessibility)
            .flat().filter(state => state != 'unknown');
        
        // Use state with the biggest consensus or most recent timestamp
        // to determine the overall accessibility
        states.sort((a, b) => {
            return (states.filter(d => b == d).length -
                states.filter(c => a == c).length) ||
                (getStatePriority(a) -
                getStatePriority(b));
        });
        
        const accessibility = states[0] ?? 'unknown';
        
        // Mark any accessibility features that have over 75% consensus
        const frequencies = tags.reduce((result, current) => {
            result[current] = result[current] ? ++result[current] : 1;
            return result;
        }, {});
        
        tags = tags.filter(tag => (frequencies[tag] / reviews.length) >= 0.75);
        tags = [ ...new Set(tags) ];
        
        // Update the stop object with consensus values
        await this.updateOne({ accessibility, tags });
    }
});

export const Stop = mongoose.model('Stop', StopSchema);