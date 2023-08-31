import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@hooks/theme';
import { ErrorHandler } from '@hooks/error';
import { AuthProvider } from '@hooks/auth';
import { ErrorFullscreen } from '@components/error-fullscreen';

export const App = () => {
    return (
        <ThemeProvider>
            <ErrorHandler>
                <AuthProvider>
                    <Outlet />
                </AuthProvider>
            </ErrorHandler>
        </ThemeProvider>
    );
};

export const Catch = () => <ErrorFullscreen />;

export default App;