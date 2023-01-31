import vtPbf from 'vt-pbf';
import geojsonVt from 'geojson-vt';
import express from 'express';
import validator from 'express-validator';
import httpErrors from 'http-errors';
import { Stop } from '../models/stop.js';
import { Geometry } from '../models/geometry.js';
import { Review } from '../models/review.js';

export const router = express.Router();

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

router.get('/:z/:x/:y', validator.checkSchema(schema), async function(req, res, next) {
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

export const start = async () => {
    // Initial indexing on startup
    await generate();
    
    // Monitor updates from new seeds, alerts, or reviews
    Geometry.watch([{
        $match: {
            operationType: 'insert'
        }
    }], {
        fullDocument: 'updateLookup'
    }).on('change', async updates => {
        geometries[updates.fullDocument._id] = updates.fullDocument.geojson;
        await generate();
    });
    
    Stop.watch([{
        $match: {
            operationType: 'update'
        }
    }], {
        fullDocument: 'updateLookup'
    }).on('change', async updates => {
        const state = updates.fullDocument.alert ?
            "service-alert" : updates.fullDocument.accessibility;
        await generateSingle(updates.fullDocument._id, state);
    });
};

const icons = {
    "accessible": "accessible",
    "parking": "warning",
    "other-sometimes": "warning",
    "service-alert": "warning",
    "construction": "warning",
    "obstacles-temporary": "warning",
    "other-temporary": "warning",
    "limited-maneuverability": "warning",
    "poor-conditions": "warning",
    "other-complicated": "warning",
    "inaccessible": "inaccessible",
    "missing-landing": "inaccessible",
    "uneven-surface": "inaccessible",
    "lacks-curb": "inaccessible",
    "obstacles-permanent": "inaccessible",
    "other-inaccessible": "inaccessible",
    "unknown": "unknown"
};

const generate = async (invalidate = true) => {
    const layers = [ 'stops', 'routes' ];
    
    for await (const layer of layers) {
        // Get raw GeoJSON from the database
        if (!geometries[layer]) {
            geometries[layer] = (await Geometry.findById(layer)).geojson;
        }
        
        // Inject dynamic alert data
        if (invalidate && layer == 'stops') {
            let states = {};
            const stops = await Stop.find({}, [ 'accessibility', 'alert' ]).lean();
            
            stops.forEach(stop => {
                states[stop._id] = stop.alert ? "service-alert" : stop.accessibility;
            });
            
            geometries[layer].features.forEach(stop => {
                if (states[stop.properties.stop_id]) {
                    stop.properties.wheelchair_boarding =
                        icons[states[stop.properties.stop_id]];
                }
            });
        }
        
        // Index the layer for quick distribution later
        indicies[layer] = geojsonVt(geometries[layer], { maxZoom: 16 });
    }
};

const generateSingle = async (id, state) => {
    geometries.stops.features.forEach(stop => {
        if (stop.properties.stop_id == id) {
            stop.properties.wheelchair_boarding = icons[state];
        }
    });
    
    await generate(false);
};