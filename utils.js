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

export { cleanKeyPattern };