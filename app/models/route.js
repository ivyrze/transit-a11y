import mongoose from 'mongoose';
import { pojoCleanup } from '../../utils.js';

const RouteSchema = new mongoose.Schema({
    _id: String,
    name: String,
    number: String,
    color: String,
    directions: [{
        heading: String,
        segments: [[[{
            type: String,
            ref: 'Stop'
        }]]]
    }]
}, {
    id: false,
    versionKey: false,
    toObject: {
        transform: pojoCleanup
    }
});

RouteSchema.method({
    getAgencyKey() {
        return this._id.split('-').slice(0, -1).join('-');
    }
});

export const Route = mongoose.model('Route', RouteSchema);