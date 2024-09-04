import { z } from 'zod';
import { error } from '@sveltejs/kit';

export const validate = async (schema, values) => {
    if (values instanceof FormData) {
        values = [ ...values.keys() ].reduce((accumulator, key) => {
            const entryArray = values.getAll(key);
            const entry = entryArray.length === 1 ?
                entryArray[0] : entryArray;

            accumulator[key] = entry;
            return accumulator;
        }, {});
    }

    const validation = await schema.safeParseAsync(values);

    if (!validation.success) {
        let errors = {};
        validation.error.issues.forEach(error => {
            error.path.forEach(path => {
                errors[path] = error.message;
            });
        });

        error(400, { errors });
    }

    return validation.data;
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