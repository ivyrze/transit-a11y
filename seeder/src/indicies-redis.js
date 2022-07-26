import { SchemaFieldTypes } from 'redis';

const indicies = async client => {
    const existing = await client.ft._list();
    
    if (!existing.includes('idx:stops')) {
        return client.ft.create('idx:stops',
            {
                name: { type: SchemaFieldTypes.TEXT },
                coordinates: { type: SchemaFieldTypes.GEO }
            },
            {
                ON: 'HASH',
                PREFIX: 'stops:'
            }
        );
    } else {
        console.log("Skipping index creation – already exists.");
        return Promise.resolve();
    }
};

export { indicies };