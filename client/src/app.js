import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './hooks/theme';
import { ErrorHandler } from './hooks/error';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { LogoutPage } from './pages/logout';
import { SignUpPage } from './pages/sign-up';
import { ErrorPage } from './pages/error';

export const App = () => {
    return pug`
        ThemeProvider
            ErrorHandler
                Routes
                    Route(path="/" element=${pug`IndexPage`})
                    Route(path="/agency/:agency" element=${pug`IndexPage`})
                    Route(path="/account/login" element=${pug`LoginPage`})
                    Route(path="/account/logout" element=${pug`LogoutPage`})
                    Route(path="/account/sign-up" element=${pug`SignUpPage`})
                    Route(path="*" element=${pug`ErrorPage(status=404)`})
    `;
};