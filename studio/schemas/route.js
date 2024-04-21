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
            of: [{ type: 'shape' }],
            title: 'Shapes',
            description: 'Overrides the provided route shapes'
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