import dotenv from 'dotenv';
import { default as mapboxBase } from '@mapbox/mapbox-sdk/index.js';
import { default as mapboxTilesets } from '@mapbox/mapbox-sdk/services/tilesets.js';

dotenv.config();

export const mapbox = async (id, geojson) => {
    const client = mapboxTilesets(mapboxBase({ accessToken: process.env.MAPBOX_ACCESS_TOKEN }));
    
    try {
        await deleteTileset(client, id)
        await deleteTilesetSource(client, id);
    } catch (error) {
        if (error.statusCode != 404) {
            console.error("Failed to delete Mapbox tileset and/or source.");
            throw error;
        }
    }
    
    try {
        var response = await createTilesetSource(client, id, geojson);
    } catch (error) {
        console.error("Failed to create Mapbox tileset.");
        throw error;
    }
    
    try {
        await createTileset(client, id, response.body.id);
    } catch (error) {
        console.error("Failed to create Mapbox tileset source.");
        throw error;
    }
    console.log("Uploaded Mapbox tileset successfully.");
    
    try {
        await publishTileset(client, id);
    } catch (error) {
        console.error("Failed to publish Mapbox tileset.");
        throw error;
    }
    console.log("Published Mapbox tileset successfully. It may take a few minutes before processing completes.");
};

const createTilesetSource = (client, id, geojson) => {
    return client.createTilesetSource({
        id: id,
        file: geojson
    }).send();
};

const createTileset = (client, id, source) => {
    return client.createTileset({
        tilesetId: process.env.MAPBOX_USERNAME + "." + id,
        name: id,
        recipe: {
            version: 1,
            layers: {
                [id]: {
                    source: source,
                    minzoom: 8,
                    maxzoom: 13
                }
            }
        }
    }).send();
};

const publishTileset = (client, id) => {
    return client.publishTileset({
        tilesetId: process.env.MAPBOX_USERNAME + "." + id
    }).send();
};

const deleteTilesetSource = (client, id) => {
    return client.deleteTilesetSource({ id }).send();
};

const deleteTileset = (client, id) => {
    return client.deleteTileset({
        tilesetId: process.env.MAPBOX_USERNAME + "." + id
    }).send();
};