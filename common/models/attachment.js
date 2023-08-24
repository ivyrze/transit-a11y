import mongoose from 'mongoose';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const AttachmentSchema = new mongoose.Schema({
    _id: String,
    type: String,
    sizes: [{
        quality: String,
        width: Number,
        height: Number
    }, {
        _id: false,
        id: false
    }]
}, {
    id: false,
    versionKey: false
});

AttachmentSchema.virtual('filename').get(function () {
    return this._id + '.' + this.type.split('/')[1];
});

AttachmentSchema.method({
    async cleanup() {
        const client = new S3Client();
        const qualities = [ 'original', 'large', 'small' ];
        await Promise.all(qualities.map(quality => {
            return client.send(new DeleteObjectCommand({
                Key: quality + '/' + this.toObject({ virtuals: true }).filename,
                Bucket: process.env.AWS_BUCKET_NAME
            }));
        }))
    }
});