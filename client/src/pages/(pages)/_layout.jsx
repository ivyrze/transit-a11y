import React from 'react';
import { Header } from '@components/header';
import { Outlet } from 'react-router-dom';

export const PageLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default PageLayout;