import React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@hooks/theme';
import { ErrorHandler } from '@hooks/error';
import { AuthProvider } from '@hooks/auth';
import { ErrorFullscreen } from '@components/error-fullscreen';
import { Analytics } from '@vercel/analytics/react';

export const App = () => {
    return (
        <>
            <Helmet
                defaultTitle="is the metro accessible?"
                titleTemplate="%s | is the metro accessible?"
            />
            <ThemeProvider>
                <ErrorHandler>
                    <AuthProvider>
                        <Outlet />
                    </AuthProvider>
                </ErrorHandler>
            </ThemeProvider>
            <Analytics />
        </>
    );
};

export const Catch = () => <ErrorFullscreen />;

export default App;