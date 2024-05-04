import { zValidator } from '@hono/zod-validator';
import { createMiddleware } from 'hono/factory';
import { z } from 'zod';

export const validator = (target, schema) => {
    if (target == 'form') {
        return createMiddleware(async (c, next) => {
            const value = await c.req.parseBody({ all: true });
            const result = await schema.safeParseAsync(value);
            const response = zodCallback(result, c);

            if (response instanceof Response) {
                return response;
            }
            c.req.addValidatedData(target, result.data);
            
            await next();
        });
    } else {
        return zValidator(target, schema, zodCallback);
    }
};

const zodCallback = (result, c) => {
    if (!result.success) {
        let errors = {};
        result.error.issues.forEach(error => {
            error.path.forEach(path => {
                errors[path] = error.message;
            });
        });
        
        c.status(400);
        return c.json({ errors });
    }
};

export const zCoerceArray = (zChain, defaultVal) => {
    let baseType = z.any();
    if (defaultVal) {
        baseType = baseType.default(defaultVal);
    }

    return baseType.transform(val => {
        return Array.isArray(val) ? val : [ val ];
    }).pipe(zChain.array());
};

export default validator;