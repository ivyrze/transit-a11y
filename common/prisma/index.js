import { PrismaClient } from '@prisma/client';
import { ReviewMethods } from './review.js';
import { ReviewAttachmentVirtuals, ReviewAttachmentMethods } from './attachment.js';
import { RouteVirtuals } from './route.js';
import { StopVirtuals, StopMethods } from './stop.js';
import { UserVirtuals, UserMethods } from './user.js';

export const prisma = new PrismaClient().$extends({
    result: {
        reviewAttachment: ReviewAttachmentVirtuals,
        route: RouteVirtuals,
        stop: StopVirtuals,
        user: UserVirtuals
    },
    model: {
        review: ReviewMethods,
        reviewAttachment: ReviewAttachmentMethods,
        stop: StopMethods,
        user: UserMethods
    }
});