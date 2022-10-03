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
            name: 'synonyms',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'Synonyms',
            description: 'Alternate stop names that could appear in service alerts'
        },
        {
            name: 'accessibility',
            type: 'string',
            title: 'Accessibility state',
            description: 'Overrides the provided wheelchair boarding value, but not warnings from alerts',
            options: {
                list: [
                    { title: 'Defer to agency', value: undefined },
                    { title: 'Likely accessible', value: '1' },
                    { title: 'Not accessible', value: '2' },
                ]
            }
        },
        {
            name: 'description',
            type: 'text',
            title: 'Accessibility description',
            description: 'Overrides the generic accessibility state description',
            rows: 3
        },
        {
            name: 'tags',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'Tags',
            description: 'Known accessibility attributes, assuming working order',
            options: {
                list: [
                    { title: 'At-grade', value: 'at-grade' },
                    { title: 'Above-grade', value: 'above-grade' },
                    { title: 'Below-grade', value: 'below-grade' },
                    { title: 'Elevator', value: 'elevator' },
                    { title: 'Escalator', value: 'escalator' },
                    { title: 'Ramp entrance', value: 'ramp-entrance' },
                ],
                sortable: false
            }
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