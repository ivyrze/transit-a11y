import color from 'color';

const colorSort = (a, b) => {
    return (color(a.color).hue() > color(b.color).hue()) ? 1 : -1;
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

export { colorSort, cleanKeyPattern };