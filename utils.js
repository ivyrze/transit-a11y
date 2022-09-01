import dotenv from 'dotenv';
import color from 'color';

dotenv.config();

const sanityOptions = {
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.NODE_ENV ?? 'development',
    apiVersion: "2021-10-21",
    useCdn: false
};

const colorSort = (a, b) => {
    return (color(a.color).hue() > color(b.color).hue()) ? 1 : -1;
};

const cleanKeyPattern = (client, pattern) => {
    return new Promise(async (resolve) => {
        let stream = client.scanIterator({
            MATCH: pattern,
            COUNT: 100
        });
    
        for await (const key of stream) {
            client.unlink(key);
        }
        
        resolve();
    });
};

export { sanityOptions, colorSort, cleanKeyPattern };