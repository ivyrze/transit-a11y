import { prisma } from './index.js';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';

export const UserVirtuals = {
    avatar: {
        needs: { email: true },
        compute: user => {
            const options = { size: 200, protocol: 'https', default: 'mp' };
            return gravatar.url(user.email, options);
        }
    }
};

export const UserMethods = {
    verifyPassword: async (username, password) => {
        const { password: hash } = await prisma.user.findUnique({
            select: {
                password: true,
            },
            where: {
                username
            }
        });
        return await bcrypt.compare(password, hash)
    },
    hashPassword: password => {
        return bcrypt.hash(password);
    }
};