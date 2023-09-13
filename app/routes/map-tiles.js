import vtPbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';
import express from 'express';
import validator from 'express-validator';
import promiseRouter from 'express-promise-router';
import httpErrors from 'http-errors';
import { prisma } from '../../common/prisma/index.js';
import { getStateGroup } from '../../common/a11y-states.js';

export const router = promiseRouter();

const schema = {
    z: {
        in: 'params',
        isInt: true,
        toInt: true
    },
    x: {
        in: 'params',
        isInt: true,
        toInt: true
    },
    y: {
        in: 'params',
        isInt: true,
        toInt: true
    }
};

router.get('/:z/:x/:y', validator.checkSchema(schema), async (req, res, next) => {
    // Check incoming parameters
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        next(new httpErrors.BadRequest()); return;
    }
    
    const { z, x, y } = validator.matchedData(req);
    
    // Generate binary data from the indexed geometry layers
    var tiles = {};
    Object.keys(indicies).forEach(layer => {
        tiles[layer] = indicies[layer].getTile(z, x, y);
    });
    
    if (!Object.values(tiles).includes(null)) {
        const buffer = vtPbf.fromGeojsonVt(tiles, { version: 2, maxZoom: 16 });
        
        res.write(buffer, 'binary');
        res.end(null, 'binary');
    } else {
        res.send();
    }
});

var geometries = {};
var indicies = {};

export const generate = async (invalidate = true) => {
    const layers = [ 'stops', 'routes' ];
    
    for await (const layer of layers) {
        // Get raw GeoJSON from the database
        if (!geometries[layer]) {
            geometries[layer] = (await prisma.geometry.findUnique({
                where: { id: layer }
            })).geojson;
        }
        
        // Inject dynamic alert data
        if (invalidate && layer == 'stops') {
            let states = {};
            const stops = await prisma.stop.findMany({
                select: {
                    id: true,
                    accessibility: true
                },
                where: {
                    NOT: {
                        accessibility: "unknown"
                    }
                }
            });
            
            stops.forEach(stop => {
                states[stop.id] = stop.accessibility;
            });
            
            geometries[layer].features.forEach(stop => {
                stop.properties.wheelchair_boarding =
                    states[stop.properties.stop_id] ?
                    getStateGroup(states[stop.properties.stop_id]).style :
                    "unknown";
            });
        }
        
        // Index the layer for quick distribution later
        indicies[layer] = geojsonVt(geometries[layer], { maxZoom: 16 });
    }
};

export const invalidateSingle = async (id, state) => {
    geometries.stops.features.forEach(stop => {
        if (stop.properties.stop_id != id) { return; }
        stop.properties.wheelchair_boarding = getStateGroup(state).style;
    });
    await generate(false);
};