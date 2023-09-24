import { prisma } from './index.js';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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
        jpeg: 'image/jpeg',
        heif: 'image/heic'
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
    uploadAndPrepareCreate: async (original, alt) => {
        const id = randomUUID();
        
        const { format } = await sharp(original).metadata();
        const type = prisma.reviewAttachment.allowedFormats[format];
        
        const processableOriginal = (format == 'heif') ?
            await heicConvert({
                buffer: original,
                format: 'png'.toUpperCase()
            }) : original;
        
        const sizes = await Promise.all(prisma.reviewAttachment.defaultProxySizes.map(size => {
            return prisma.reviewAttachment.createSizeObject(
                id, size.quality == "original" ? original : processableOriginal, size
            );
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
        
        await prisma.reviewAttachment.uploadFile(proxy, size.quality, id, extension);
        
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
    isValidFormat: async buffer => {
        const metadata = await sharp(buffer).metadata();
        return Object.keys(prisma.reviewAttachment.allowedFormats)
            .includes(metadata.format);
    },
    uploadFile: (buffer, quality, id, extension) => {
        const client = new S3Client();
        const command = new PutObjectCommand({
            Key: quality + '/' + id + '.' + extension,
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: buffer
        });
        return client.send(command);
    },
    downloadFile: (quality, filename) => {
        const client = new S3Client();
        const command = new GetObjectCommand({
            Key: quality + '/' + filename,
            Bucket: process.env.AWS_BUCKET_NAME
        });
        return client.send(command);
    },
    deleteFile: (quality, id, extension) => {
        const client = new S3Client();
        const command = new DeleteObjectCommand({
            Key: quality + '/' + id + '.' + extension,
            Bucket: process.env.AWS_BUCKET_NAME
        });
        return client.send(command);
    },
    cleanupAndDelete: async id => {
        const { type } = await prisma.reviewAttachment.findUnique({
            select: { type: true },
            where: { id }
        });
        
        await Promise.all(prisma.reviewAttachment.defaultProxySizes.map(size => {
            const extension = size.quality == "original" ?
                type.split('/')[1] : "jpeg";
            return prisma.reviewAttachment.deleteFile(size.quality, id, extension)
        }));
        
        await prisma.reviewAttachment.delete({ where: { id } });
    }
};