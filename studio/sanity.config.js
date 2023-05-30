import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { colorInput } from "@sanity/color-input";
import schemas from './schemas/schema';
import deskStructure from './desk-structure';

export default defineConfig({
    name: 'default',
    title: 'transit-a11y',
    dataset: import.meta.env.MODE,
    projectId: import.meta.env.SANITY_STUDIO_API_PROJECT_ID,
    plugins: [
        deskTool({ structure: deskStructure }),
        visionTool(),
        colorInput()
    ],
    schema: {
        types: schemas,
    },
});