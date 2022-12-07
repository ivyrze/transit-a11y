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

const ConsensusTrigger = async function (review) {
    await review.populate('stop');
    await review.stop.consensus();
};

ReviewSchema.post('save', ConsensusTrigger);
ReviewSchema.post('deleteOne', { document: true }, ConsensusTrigger);

export const Review = mongoose.model('Review', ReviewSchema);