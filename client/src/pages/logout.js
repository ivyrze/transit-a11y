import React, { useEffect} from 'react';
import { useQuery } from '../hooks/query';
import { useAuth } from '../hooks/auth';

export const LogoutPage = () => {
    const { setAuth } = useAuth();
    
    useQuery({
        method: 'get',
        url: '/api/account/logout'
    });
    
    useEffect(() => setAuth({}), [ setAuth ]);
    
    return pug`
        p Logged out
    `;
};