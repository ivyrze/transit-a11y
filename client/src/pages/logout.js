import React from 'react';
import { useQuery } from '../hooks/query';

export const LogoutPage = () => {
    useQuery({
        method: 'get',
        url: '/api/account/logout'
    });
    
    return pug`
        p Logged out
    `;
};