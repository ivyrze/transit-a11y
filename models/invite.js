import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
    invite: String
}, {
    id: false,
    versionKey: false
});

export const Invite = mongoose.model('Invite', InviteSchema);