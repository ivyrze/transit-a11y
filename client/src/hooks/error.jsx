import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorPage } from '../pages/error';

const ErrorStatusContext = createContext();

export const ErrorHandler = ({ children }) => {
    const location = useLocation();
    const [ errorStatus, setErrorStatus ] = useState();
    
    useEffect(() => setErrorStatus(null), [ location ]);
        
    const contextPayload = useMemo(
        () => ({ setErrorStatus }), [ setErrorStatus ]
    );
    
    return pug`
        ErrorStatusContext.Provider(value=contextPayload)
            if errorStatus
                ErrorPage(...errorStatus)
            else
                | ${children}
    `;
};

export const useErrorStatus = () => useContext(ErrorStatusContext);