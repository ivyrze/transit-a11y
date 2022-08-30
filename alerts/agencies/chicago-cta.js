import axios from 'axios';

const endpoint = 'http://lapi.transitchicago.com/api/1.0/alerts.aspx?outputType=json';
const agencyPrefix = 'cta';

const status = () => {
    return new Promise((resolve, error) => {
        axios.get(endpoint).then(response => {
            if (!response.data ||
                !response.data.CTAAlerts ||
                !response.data.CTAAlerts.Alert) {
                error(); return;
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
            
            resolve(alerts);
        });
    });
};

export { status };