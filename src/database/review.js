import { prisma } from './index.js';

export const ReviewMethods = {
    cleanupAndDelete: async id => {
        const review = await prisma.review.findUnique({
            select: { attachments: { select: { id: true } } },
            where: { id }
        });
        await Promise.all(review.attachments.map(attachment => {
            return prisma.reviewAttachment.cleanupAndDelete(attachment.id);
        }));
        await prisma.review.delete({ where: { id } });
    }
};