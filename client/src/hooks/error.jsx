import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorFullscreen } from '@components/error-fullscreen';

const ErrorStatusContext = createContext();

export const ErrorHandler = ({ children }) => {
    const location = useLocation();
    const [ errorStatus, setErrorStatus ] = useState();
    
    useEffect(() => setErrorStatus(null), [ location ]);
        
    const contextPayload = useMemo(
        () => ({ setErrorStatus }), [ setErrorStatus ]
    );
    
    return (
        <ErrorStatusContext.Provider value={ contextPayload }>
            { errorStatus ? (
                <ErrorFullscreen { ...errorStatus } />
            ) : children }
        </ErrorStatusContext.Provider>
    );
};

export const useErrorStatus = () => useContext(ErrorStatusContext);