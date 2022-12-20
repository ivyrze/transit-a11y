import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    api: {
        dataset: process.env.NODE_ENV,
        projectId: process.env.SANITY_STUDIO_API_PROJECT_ID
    }
});