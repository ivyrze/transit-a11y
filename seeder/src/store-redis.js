const store = async (client, stops) => {
    return new Promise(resolve => {
        console.log("Storing " + stops.length + " stops into the database...");
        
        stops.forEach(stop => {
            client.sAdd('stops', stop.stop_id);
            client.hSet('stops:' + stop.stop_id, 'name', stop.stop_name);
            client.hSet('stops:' + stop.stop_id, 'accessibility', stop.wheelchair_boarding);
            client.geoAdd('stops-geospatial', {
                longitude: stop.stop_lon,
                latitude: stop.stop_lat,
                member: stop.stop_id
            });
        });
        
        resolve();
    }).then(() => {
        console.log("Storing stop data completed successfully.");
    });
};

export { store };