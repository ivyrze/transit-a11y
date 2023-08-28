import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMapStore } from '@hooks/store';

export const AgencyPage = () => {
    const { agency } = useParams();
    
    const setStartupAgency = useMapStore(state => state.setStartupAgency);
    
    useEffect(() => {
        setStartupAgency(agency);
        return () => setStartupAgency(false);
    }, [ agency, setStartupAgency ]);
};

export default AgencyPage;