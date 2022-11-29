import axios from 'axios';
import { Stop } from '../../models/stop.js';

const endpoint = 'https://developer.trimet.org/ws/v2/alerts';
const agencyPrefix = 'trimet';

export const status = async synonyms => {
    // Request alerts from agency API
    const response = await axios.get(endpoint, {
        params: { appID: process.env.TRIMET_APP_ID }
    });
    
    if (!response.data ||
        !response.data.resultSet ||
        !response.data.resultSet.alert) {
        throw "Unexpected response format";
    }
    
    let alerts = {};
    response.data.resultSet.alert.forEach(async alert => {
        // Extract stop name from alert description
        let name = alert.desc.match(/(?:elevator).*?\s(?<name>[A-Z\d][\w]*(?:[\s\-\/]+[A-Z\d&][\w]*)+)/);
        if (!name) { return; }
        name = name.groups.name.replace("MAX Station", "").trim();
        
        // Attempt lookup in synonym set dictionary
        let stop = synonyms.find(stop => {
            return stop.synonyms.includes(name) && stop.agency == agencyPrefix;
        });
        
        if (stop) {
            // Synonym search was successful
            stop = stop.agency + '-' + stop.id;
        } else {
            // Lookup stop ID from stop name instead
            stop = (await Stop.find({ name }, [ '_id' ]).lean())[0]?._id;
            if (!stop || !stop.startsWith(agencyPrefix)) { return; }
        }
        
        // Create user-friendly description
        const description = alert.desc.replace("For help around this closure:", "").trim();
        
        alerts[stop] = {
            description: description,
            ...(alert.info_link_url && { url: alert.info_link_url })
        };
    });
    
    return alerts;
};