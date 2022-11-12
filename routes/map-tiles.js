import vtPbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';
import express from 'express';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { redisOptions } from '../utils.js';

const generateTileIndicies = async () => {
    const layers = [ 'stops', 'routes' ];
    
    // Establish database connection
    const client = createClient(redisOptions);
    client.on('error', error => console.error(error));
    
    await client.connect();
    
    var indicies = {};
    for await (const layer of layers) {
        // Get raw GeoJSON from the database
        const geojson = JSON.parse(await client.get('geometry:' + layer));
        
        // Inject dynamic alert data
        if (layer == 'stops') {
            const alerts = await client.sMembers('alerts');
            geojson.features.forEach(stop => {
                if (alerts.includes(stop.properties.stop_id)) {
                    stop.properties.wheelchair_boarding = 3;
                }
            });
        }
        
        // Index the layer for quick distribution later
        indicies[layer] = geojsonVt(geojson, { maxZoom: 24 });
    }
    
    client.quit();
    
    return indicies;
};

var indicies = await generateTileIndicies();

setInterval(async () => indicies = await generateTileIndicies(), 60 * 1000);

export const router = express.Router();

router.get('/:z/:x/:y', async function(req, res, next) {
    // Check incoming parameters
    if (!req.params.z ||
        !req.params.x ||
        !req.params.y) {
        next(new httpErrors.BadRequest()); return;
    }
    
    // Generate binary data from the indexed geometry layers
    const z = parseInt(req.params.z);
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);
    
    var tiles = {};
    Object.keys(indicies).forEach(layer => {
        tiles[layer] = indicies[layer].getTile(z, x, y);
    });
    
    if (!Object.values(tiles).includes(null)) {
        const buffer = vtPbf.fromGeojsonVt(tiles, { version: 2 });
        
        res.write(buffer, 'binary');
        res.end(null, 'binary');
    } else {
        res.send();
    }
});