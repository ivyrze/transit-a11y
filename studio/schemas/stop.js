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
            name: 'name',
            type: 'string',
            title: 'Name',
            description: 'Overrides the provided stop name'
        },
        {
            name: 'synonyms',
            type: 'array',
            of: [{ type: 'string' }],
            title: 'Synonyms',
            description: 'Alternate stop names that could appear in service alerts'
        },
        {
            name: 'linked',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'stop' } }],
            title: 'Linked stops',
            description: 'Overrides automatically generated child stop links'
        },
        {
            name: 'unlinked',
            type: 'boolean',
            title: 'Unlink stops',
            description: 'When checked, all child stop links are removed'
        },
        {
            name: 'accessibility',
            type: 'string',
            title: 'Accessibility state',
            description: 'Overrides the provided wheelchair boarding value',
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
            name: 'removed',
            type: 'boolean',
            title: 'Skip importing',
            description: 'When checked, this stop will be removed from the dataset during import'
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