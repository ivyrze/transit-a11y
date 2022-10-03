export default {
    name: 'agency',
    type: 'document',
    title: 'Agency',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'Identifier',
            description: 'Reference to agency key provided in seeder configuration',
            validation: rule => rule.required()
        },
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            description: 'Overrides the provided agency name'
        }
    ],
    preview: {
        select: {
            title: 'id'
        }
    }
}