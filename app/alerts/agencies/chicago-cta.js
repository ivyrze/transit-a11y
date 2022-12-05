import axios from 'axios';

const endpoint = 'http://lapi.transitchicago.com/api/1.0/alerts.aspx?outputType=json';
const agencyPrefix = 'cta';

export const status = async () => {
    const response = await axios.get(endpoint);
    
    if (!response.data ||
        !response.data.CTAAlerts ||
        !response.data.CTAAlerts.Alert) {
        throw "Unexpected response format";
    }
    
    let alerts = {};
    response.data.CTAAlerts.Alert.forEach(alert => {
        if (alert.Impact.startsWith("Elevator")) {
            // Handle returned type inconsistency
            let services = alert.ImpactedService.Service;
            if (!Array.isArray(services)) {
                services = [ services ];
            }
            
            // Grab affected train stop ID
            let stop;
            services.forEach(service => {
                if (service.ServiceType == 'T') {
                    stop = service.ServiceId;
                }
            });
            
            if (!stop) { return; }
            
            // Also add alert description and link
            alerts[agencyPrefix + '-' + stop] = {
                description: alert.ShortDescription,
                url: alert.AlertURL['#cdata-section'],
            };
        }
    });
    
    return alerts;
};