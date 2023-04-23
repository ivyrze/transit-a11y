import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import { pojoCleanup } from '../../utils.js';

const UserSchema = new mongoose.Schema({
    _id: String,
    email: String,
    username: {
        type: String,
        index: true
    },
    password: String,
    created: String,
    admin: Boolean
}, {
    id: false,
    versionKey: false,
    toObject: {
        transform: pojoCleanup
    }
});

UserSchema.virtual('avatar').get(function () {
    const options = { size: 200, protocol: 'https', default: 'mp' };
    return gravatar.url(this.email, options);
});

UserSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'author'
});

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password);
    }
});

UserSchema.method({
    verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
});

export const User = mongoose.model('User', UserSchema);