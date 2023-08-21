import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { queryHelper } from './query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ auth, setAuth ] = useState();
    const [ authRedirect, setAuthRedirect ] = useState();
    
    useEffect(() => {
        const updateAuth = async () => {
            const response = await queryHelper({
                method: 'get',
                url: '/api/check-auth'
            });
            setAuth(response.data);
        };
        updateAuth();
    }, [ setAuth ]);
    
    const contextPayload = useMemo(
        () => ({ auth, setAuth, authRedirect, setAuthRedirect }),
        [ auth, setAuth, authRedirect, setAuthRedirect ]
    );
    
    return (
        <AuthContext.Provider value={ contextPayload }>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);