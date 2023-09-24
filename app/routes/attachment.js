import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';

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

router.get('/:quality/:filename', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { quality, filename } = validator.matchedData(req);
    
    // Proxy image request to S3 bucket
    try {
        const response = await prisma.reviewAttachment.downloadFile(quality, filename);
        response.Body.pipe(res);
    } catch {
        next(new httpErrors.NotFound()); return;
    }
});