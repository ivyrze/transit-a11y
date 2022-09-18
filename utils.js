import dotenv from 'dotenv';
import color from 'color';

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

export const colorSort = (a, b) => {
    return (color(a.color).hue() > color(b.color).hue()) ? 1 : -1;
};

export const cleanKeyPattern = async (client, pattern) => {
    let stream = client.scanIterator({
        MATCH: pattern,
        COUNT: 100
    });

    for await (const key of stream) {
        client.unlink(key);
    }
};