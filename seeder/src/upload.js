import dotenv from 'dotenv';
import { default as mapboxBase } from '@mapbox/mapbox-sdk/index.js';
import { default as mapboxTilesets } from '@mapbox/mapbox-sdk/services/tilesets.js';

dotenv.config();

const mapbox = (id, geojson) => {
    return new Promise((resolve, error) => {
        const client = mapboxTilesets(mapboxBase({ accessToken: process.env.MAPBOX_ACCESS_TOKEN }));
        
        Promise.all([ deleteTileset(client, id), deleteTilesetSource(client, id) ])
            .catch(response => {
                if (response.statusCode != 404) {
                    console.error("Failed to delete Mapbox tileset and/or source.", error);
                    error();
                }
            })
            .finally(() => {
                createTilesetSource(client, id, geojson).then(response => {
                    createTileset(client, id, response.body.id).then(() => {
                        console.log("Uploaded Mapbox tileset successfully.");
                        publishTileset(client, id).then(() => {
                            console.log("Published Mapbox tileset successfully. It may take a few minutes before processing completes.");
                            resolve();
                        }).catch(error => {
                            console.log("Failed to publish Mapbox tileset.", error);
                            error();
                        });
                    }).catch(error => {
                        console.log("Failed to create Mapbox tileset.", error);
                        error();
                    });
                }).catch(error => {
                    console.error("Failed to create Mapbox tileset source.", error);
                    error();
                });
            });
    });
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
                    maxzoom: 10
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
    return client.deleteTilesetSource({
        id: id
    }).send();
};

const deleteTileset = (client, id) => {
    return client.deleteTileset({
        tilesetId: process.env.MAPBOX_USERNAME + "." + id
    }).send();
};

export { mapbox };