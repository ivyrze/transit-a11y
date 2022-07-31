const clean = client => {
    console.log("Cleaning existing GTFS data...");
    
    return Promise.all([
        client.del("stops"),
        client.del("routes"),
        cleanKeyPattern(client, "stops:*"),
        cleanKeyPattern(client, "routes:*")
    ]).then(() => {
        console.log("Cleaning completed successfully.");
    });
};

const cleanKeyPattern = (client, pattern) => {
    return new Promise(async (resolve) => {
        let stream = client.scanIterator({
            MATCH: pattern,
            COUNT: 100
        });
    
        for await (const key of stream) {
            client.unlink(key);
        }
        
        resolve();
    });
};

export { clean };