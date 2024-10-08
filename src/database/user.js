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
    hashPassword: async password => {
        return await bcrypt.hash(password, 11);
    },
    hasRole: async (id, requiredRole) => {
        const { role } = await prisma.user.findUnique({
            select: {
                role: true
            },
            where: {
                id
            }
        });
        return role === requiredRole;
    }
};