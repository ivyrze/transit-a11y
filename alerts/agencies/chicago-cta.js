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
                    let stop;
                    alert.ImpactedService.Service.forEach(service => {
                        if (service.ServiceType == 'T') {
                            stop = service.ServiceId;
                        }
                    });
                    
                    alerts[agencyPrefix + '-' + stop] = {
                        description: alert.ShortDescription,
                        link: alert.AlertURL['#cdata-section'],
                    };
                }
            });
            
            resolve(alerts);
        });
    });
};

export { status };