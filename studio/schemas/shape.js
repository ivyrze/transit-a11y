import { ShapeInput } from "../components/ShapeInput";

export default {
    name: 'shape',
    type: 'document',
    title: 'Shape',
    fields: [
        {
            name: 'geojson',
            type: 'string',
            components: {
                input: ShapeInput
            },
            title: 'GeoJSON',
            description: 'Shape for a single direction of the route. Must be a GeoJSON Feature with LineString geometry.',
            rows: 4,
            validation: rule => rule.required()
        }
    ]
}