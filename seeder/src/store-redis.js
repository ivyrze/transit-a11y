const store = async (client, stops) => {
    return new Promise(resolve => {
        console.log("Storing " + stops.length + " stops into the database...");
        
        stops.forEach(stop => {
            client.sAdd('stops', stop.stop_id);
            client.hSet('stops:' + stop.stop_id, 'name', stop.stop_name);
            client.hSet('stops:' + stop.stop_id, 'accessibility', stop.wheelchair_boarding);
            client.hSet('stops:' + stop.stop_id, 'coordinates', stop.stop_lon + ',' + stop.stop_lat);
        });
        
        resolve();
    }).then(() => {
        console.log("Storing stop data completed successfully.");
    });
};

export { store };