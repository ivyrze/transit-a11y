export default {
    name: 'agency',
    type: 'document',
    title: 'Agency',
    fields: [
        {
            name: 'id',
            type: 'string',
            title: 'Agency identifier',
            description: 'Reference to agency key provided in seeder configuration',
            validation: rule => rule.required()
        }
    ]
}