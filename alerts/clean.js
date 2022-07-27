const clean = client => {
    return Promise.all([
        client.del("alerts"),
        cleanKeyPattern(client, "alerts:*")
    ]);
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