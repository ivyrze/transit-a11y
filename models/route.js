import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
    _id: String,
    name: String,
    number: String,
    color: String
}, {
    id: false,
    versionKey: false
});

export const Route = mongoose.model('Route', RouteSchema);