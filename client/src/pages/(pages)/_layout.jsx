import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@components/header';
import { Outlet } from 'react-router-dom';

import '@assets/styles/components/page-layout.scss';

export const PageLayout = () => {
    return (
        <>
            <Helmet>
                <body className="page-layout" />
            </Helmet>
            <Header />
            <Outlet />
        </>
    );
};

export default PageLayout;