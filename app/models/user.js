import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';

const UserSchema = new mongoose.Schema({
    _id: String,
    email: String,
    username: String,
    password: String,
    created: String
}, {
    id: false,
    versionKey: false
});

UserSchema.virtual('avatar').get(function () {
    const options = { size: 100, protocol: 'https', default: 'mp' };
    return gravatar.url(this.email, options);
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