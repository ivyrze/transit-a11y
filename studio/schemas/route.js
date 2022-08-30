export default {
    name: 'stop',
    type: 'document',
    title: 'Stop',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'Identifier',
            description: 'Reference to this stop\'s unique GTFS identifier',
            validation: rule => rule.required()
        },
        {
            name: 'url',
            type: 'string',
            title: 'Source link',
            description: 'Overrides the provided agency-wide link'
        },
        {
            name: 'agency',
            title: 'Agency',
            type: 'reference',
            to: [{ type: 'agency' }],
            validation: rule => rule.required()
        }
    ]
}