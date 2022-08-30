import { createClient } from 'redis';
import axios from 'axios';

const endpoint = 'https://developer.trimet.org/ws/v2/alerts';
const agencyPrefix = 'trimet';

const status = () => {
    return new Promise(async (resolve, error) => {
        // Establish database connection
        const client = createClient({ url: process.env.REDIS_URL });
        
        client.on('error', (err) => console.error('Redis client error', err));
        await client.connect();
        
        // Request alerts from agency API
        axios.get(endpoint, {
            params: { appID: process.env.TRIMET_APP_ID }
        }).then(response => {
            if (!response.data ||
                !response.data.resultSet ||
                !response.data.resultSet.alert) {
                error(); return;
            }
            
            let alerts = {};
            response.data.resultSet.alert.forEach(async alert => {
                // Extract stop name from alert description
                let name = alert.desc.match(/elevator at (?:the )?(?<name>.*?)(?: MAX Station)? is /i);
                if (!name) { return; }
                name = name.groups.name;
                
                // Lookup stop ID from stop name
                let stop = await client.ft.search('idx:stops', name);
                if (stop.total != 1) { return; }
                stop = stop.documents[0].id.replace('stops:', '');
                if (!stop.startsWith(agencyPrefix)) { return; }
                
                // Create user-friendly description
                const description = alert.desc.replace("For help around this closure:", "").trim();
                
                alerts[stop] = {
                    description: description,
                    url: alert.info_link_url
                };
            });
            
            client.quit();
            resolve(alerts);
        });
    });
};

export { status };