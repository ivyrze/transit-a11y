import dotenv from 'dotenv';
import * as nanoid from 'nanoid';

dotenv.config();
dotenv.config({ path: '../.env' });

export const sanityOptions = {
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.NODE_ENV ?? 'development',
    apiVersion: "2021-10-21",
    useCdn: false
};

export const attachExitHandler = func => {
    [ 'SIGINT', 'SIGTERM', 'SIGQUIT' ].forEach(event => {
        process.on(event, async () => { await func(); process.exit(); });
    });
};

export const attachExceptionHandler = func => {
    [ 'uncaughtException', 'uncaughtPromise' ].forEach(event => {
        process.on(event, async error => { console.error(error); await func(); });
    });
};

export const errorFormatter = ({ msg }) => msg;

export const pojoCleanup = (doc, ret, options) => {
    if (options._id !== false) { return ret; }
    
    if (Array.isArray(ret)) {
        return ret.map(subret => pojoCleanup(doc, subret, options));
    } else if (typeof ret === 'object') {
        for (const i in ret) {
            if (!ret[i]) { continue; }
            ret[i] = pojoCleanup(doc, ret[i], options);
        }
        
        delete ret._id;
    }
    
    return ret;
};

export const generateUUID = () => {
    const charset = "0123456789abcdef";
    return [ 7, 6, 6, 4 ].map(length => {
        return nanoid.customAlphabet(charset, length)();
    }).join("-");
};