import mongoose from 'mongoose';
import { AttachmentSchema } from './attachment.js';

const ReviewSchema = new mongoose.Schema({
    _id: String,
    stop: {
        type: String,
        ref: 'Stop',
        index: true
    },
    accessibility: [String],
    tags: [String],
    timestamp: String,
    author: {
        type: String,
        ref: 'User',
        index: true
    },
    attachments: [AttachmentSchema],
    comments: String
}, {
    id: false,
    versionKey: false
});

const ConsensusTrigger = async function (review) {
    await review.populate('stop');
    await review.stop.consensus();
};

const CleanupTrigger = function (review) {
    return review?.attachments ?
        Promise.all(review.attachments.map(attachment => {
            return attachment.cleanup();
        })) :
        Promise.resolve();
};

ReviewSchema.post('save', ConsensusTrigger);
ReviewSchema.post('deleteOne', { document: true }, ConsensusTrigger);
ReviewSchema.post('deleteOne', { document: true }, CleanupTrigger);
ReviewSchema.post('findOneAndDelete', CleanupTrigger);

export const Review = mongoose.model('Review', ReviewSchema);