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
            name: 'agency',
            title: 'Agency',
            type: 'reference',
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