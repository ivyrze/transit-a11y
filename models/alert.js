import mongoose from 'mongoose';

export const AlertSchema = new mongoose.Schema({
    description: String,
    url: String
}, {
    _id: false,
    id: false,
    versionKey: false
});