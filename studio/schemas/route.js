export default {
    name: 'route',
    type: 'document',
    title: 'Route',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'Identifier',
            description: 'Reference to this route\'s unique GTFS identifier',
            validation: rule => rule.required()
        },
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            description: 'Overrides the provided route name'
        },
        {
            name: 'color',
            type: 'color',
            title: 'Color',
            description: 'Overrides the provided route color'
        },
        {
            name: 'shapes',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'Shapes',
            description: 'Include a shape in GeoJSON feature format for each unique trip routing'
        },
        {
            name: 'agency',
            type: 'reference',
            title: 'Agency',
            to: [{ type: 'agency' }],
            validation: rule => rule.required()
        }
    ],
    preview: {
        select: {
            title: 'id'
        }
    }
}