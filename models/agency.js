import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({
    _id: String,
    name: String,
    url: String,
    bounds: [Number],
    vehicle: String,
    reviews: Boolean,
    default: Boolean
}, {
    id: false,
    versionKey: false
});

export const Agency = mongoose.model('Agency', AgencySchema);