import mongoose from 'mongoose';
import { AlertSchema } from './alert.js';
import { pojoCleanup } from '../../utils.js';

const StopSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    coordinates: [Number],
    routes: [{
        type: String,
        ref: 'Route'
    }],
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
        
        // Use reviews with the biggest consensus or most recent timestamp
        // to determine the overall accessibility state
        reviews.sort((a, b) => {
            return (reviews.filter(d => b.accessibility == d.accessibility).length -
                reviews.filter(c => a.accessibility == c.accessibility).length) ||
                (new Date(b.timestamp) - new Date(a.timestamp));
        });
        
        const accessibility = reviews[0]?.accessibility ?? 'unknown';
        
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