import { zValidator } from '@hono/zod-validator';

export const validator = (target, schema) => {
    return zValidator(target, schema, (result, c) => {
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
    });
};

export default validator;