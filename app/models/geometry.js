import mongoose from 'mongoose';
import geojsonSchema from 'mongoose-geojson-schema';

const GeometrySchema = new mongoose.Schema({
    _id: String,
    geojson: mongoose.Schema.Types.FeatureCollection
}, {
    id: false,
    versionKey: false
});

export const Geometry = mongoose.model('Geometry', GeometrySchema);