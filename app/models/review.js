import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    _id: String,
    stop: {
        type: String,
        ref: 'Stop'
    },
    accessibility: String,
    tags: [String],
    timestamp: String,
    author: {
        type: String,
        ref: 'User'
    },
    comments: String
}, {
    id: false,
    versionKey: false
});

ReviewSchema.post('save', async function (review) {
    await review.populate('stop');
    await review.stop.consensus();
});

export const Review = mongoose.model('Review', ReviewSchema);