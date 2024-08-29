import { defineConfig } from 'sanity';
import { structureTool } from "sanity/structure";
import { visionTool } from '@sanity/vision';
import { colorInput } from "@sanity/color-input";
import { FaWheelchairMove } from 'react-icons/fa6';
import schemas from './schemas/schema';
import deskStructure from './desk-structure';

export default defineConfig({
    name: 'default',
    title: 'is the metro accessible?',
    dataset: import.meta.env.SANITY_STUDIO_DATASET,
    projectId: import.meta.env.SANITY_STUDIO_API_PROJECT_ID,
    plugins: [
        structureTool({ structure: deskStructure }),
        visionTool(),
        colorInput()
    ],
    schema: {
        types: schemas,
    },
    icon: FaWheelchairMove
});