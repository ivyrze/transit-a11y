import React, { createContext, useState, useMemo, useContext } from 'react';
import { useQuery } from '@hooks/query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: auth, mutate: mutateAuth } = useQuery({
        method: 'get',
        url: '/api/check-auth'
    }, {
        refreshInterval: 30**2 * 1000,
        revalidateOnFocus: false
    });
    
    const [ authRedirect, setAuthRedirect ] = useState();
    
    const contextPayload = useMemo(
        () => ({ auth, mutateAuth, authRedirect, setAuthRedirect }),
        [ auth, mutateAuth, authRedirect, setAuthRedirect ]
    );
    
    return (
        <AuthContext.Provider value={ contextPayload }>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);