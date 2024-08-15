import { getStatePriority } from './a11y-states.js';

export const sanityOptions = () => ({
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
    apiVersion: "2021-10-21",
    useCdn: false
});

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

export const statePrioritySort = (a, b) => {
    return getStatePriority(a) - getStatePriority(b);
};