import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export const router = promiseRouter();

const schema = {
    quality: {
        in: 'params',
        isIn: { options: [[
            'original',
            'large',
            'small'
        ]] }
    },
    filename: {
        in: 'params',
        contains: { options: '.' }
    }
};

const client = new S3Client();

router.get('/:quality/:filename', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { quality, filename } = validator.matchedData(req);
    
    // Proxy image request to S3 bucket
    try {
        const response = await client.send(new GetObjectCommand({
            Key: quality + '/' + filename,
            Bucket: process.env.AWS_BUCKET_NAME
        }));
        response.Body.pipe(res);
    } catch {
        next(new httpErrors.NotFound()); return;
    }
});