import dotenv from 'dotenv';
import color from 'color';
import * as nanoid from 'nanoid';

dotenv.config();

export const redisOptions = {
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: retries => {
            return (retries >= 3) ? 500 : new Error("Connection attempts exceeded")
        }
    }
};

export const sanityOptions = {
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.NODE_ENV ?? 'development',
    apiVersion: "2021-10-21",
    useCdn: false
};

export const errorFormatter = ({ msg }) => msg;

export const generateUUID = () => {
    const charset = "0123456789abcdef";
    return [ 7, 6, 6, 4 ].map(length => {
        return nanoid.customAlphabet(charset, length)();
    }).join("-");
};

export const colorSort = (a, b) => {
    return (color(a.color).hue() > color(b.color).hue()) ? 1 : -1;
};

export const matchKeyPattern = async (client, pattern) => {
    let stream = client.scanIterator({
        MATCH: pattern,
        COUNT: 100
    });
    
    let matches = [];
    for await (const key of stream) {
        matches.push(key);
    }
    
    return matches;
};

export const cleanKeyPattern = async (client, pattern, exclusions = []) => {
    let stream = client.scanIterator({
        MATCH: pattern,
        COUNT: 100
    });

    for await (const key of stream) {
        if (exclusions.some(exclusion => key.includes(exclusion))) {
            continue;
        }
        
        client.unlink(key);
    }
};