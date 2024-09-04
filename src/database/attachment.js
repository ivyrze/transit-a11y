import { prisma } from './index.js';
import sharp from 'sharp';
import { put, del } from '@vercel/blob';
import { randomUUID } from 'crypto';

export const ReviewAttachmentVirtuals = {
    filename: {
        needs: { id: true, type: true },
        compute: attachment => {
            return attachment.id + '.jpeg';
        }
    }
};

export const ReviewAttachmentMethods = {
    allowedFormats: {
        jpeg: 'image/jpeg'
    },
    defaultProxySizes: [
        {
            quality: 'original'
        },
        {
            quality: 'small',
            height: 250
        },
        {
            quality: 'large',
            height: 2000
        }
    ],
    uploadAndPrepareCreate: async (id, original, alt) => {
        const { format } = await sharp(original).metadata();
        const type = prisma.reviewAttachment.allowedFormats[format];
        
        const sizes = await Promise.all(prisma.reviewAttachment.defaultProxySizes.map(size => {
            return prisma.reviewAttachment.createSizeObject(id, original, size);
        }));
        
        return {
            id, type, sizes, ...(alt?.length && { alt })
        };
    },
    createSizeObject: async (id, original, size) => {
        const proxy = size.quality == "original" ?
            original : await prisma.reviewAttachment.createProxySize(original, size);
        
        const metadata = await sharp(proxy).metadata();
        const extension = prisma.reviewAttachment.allowedFormats[metadata.format].split('/')[1];
        
        if (size.quality != "original") {
            await prisma.reviewAttachment.uploadFile(proxy, size.quality, id, extension);
        }
        
        // Prepare database object
        return {
            quality: size.quality,
            width: metadata.width,
            height: metadata.height
        };
    },
    createProxySize: async (original, size) => {
        // Create resized proxy file, factoring in EXIF rotation
        return await sharp(original)
            .rotate()
            .resize({
                height: size.height,
                fit: 'inside'
            })
            .toFormat('jpeg')
            .toBuffer({
                quality: 85,
                progressive: true,
                resolveWithObject: false
            });
    },
    isValidFormat: async (buffer, expected) => {
        const metadata = await sharp(buffer).metadata();
        const allowedExtensions = Object.keys(prisma.reviewAttachment.allowedFormats);
        return allowedExtensions.includes(metadata.format) && metadata.format === expected;
    },
    getURL: (quality, filename) => {
        const storeId = process.env.BLOB_READ_WRITE_TOKEN.split('_')[3];
        return 'https://' + storeId + '.public.blob.vercel-storage.com/' +
            quality + '/' + filename;
    },
    uploadFile: async (buffer, quality, id, extension) => {
        return await put(quality + '/' + id + '.' + extension, buffer, {
            access: 'public',
            addRandomSuffix: false
        });
    },
    downloadFile: async (quality, filename) => {
        return await fetch(
            prisma.reviewAttachment.getURL(quality, filename)
        );
    },
    deleteFile: async (quality, id, extension) => {
        await del(
            prisma.reviewAttachment.getURL(quality, id + '.' + extension)
        );
    },
    cleanupAndDelete: async id => {
        const { type } = await prisma.reviewAttachment.findUnique({
            select: { type: true },
            where: { id }
        });
        
        await Promise.all(prisma.reviewAttachment.defaultProxySizes.map(size => {
            const extension = size.quality == "original" ?
                type.split('/')[1] : "jpeg";
            return prisma.reviewAttachment.deleteFile(size.quality, id, extension);
        }));
        
        await prisma.reviewAttachment.delete({ where: { id } });
    }
};