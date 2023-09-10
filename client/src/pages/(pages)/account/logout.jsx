import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '@components/link';
import { Icon } from '@components/icon';
import { useImmutableQuery } from '@hooks/query';
import { useAuth } from '@hooks/auth';

export const LogoutPage = () => {
    const { mutateAuth } = useAuth();
    
    useImmutableQuery({
        method: 'get',
        url: '/api/account/logout'
    }, {
        revalidateOnMount: true
    });
    
    useEffect(() => {
        mutateAuth({});
    }, []);
    
    return (
        <main className="notice-fullscreen">
            <Helmet>
                <title>Logout</title>
            </Helmet>
            <Icon name="login" />
            <h1>Logged out</h1>
            <p>You've successfully been logged out. Would you like to <Link to="/" className="link--regular">return home</Link> or <Link to="/account/login" className="link--regular">log back in</Link>?</p>
        </main>
    );
};

export default LogoutPage;