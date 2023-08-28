import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@hooks/theme';
import { ErrorHandler } from '@hooks/error';
import { AuthProvider } from '@hooks/auth';

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

export default App;