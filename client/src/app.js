import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './hooks/theme';
import { ErrorHandler } from './hooks/error';
import { AuthProvider } from './hooks/auth';
import { IndexPage } from './pages/index';
import { About } from './components/about';
import { StopDetails } from './components/stop-details';
import { ReviewForm } from './components/review-form';
import { RouteList } from './components/route-list';
import { RouteDetails } from './components/route-details';
import { ProfilePage } from './pages/profile';
import { LoginPage } from './pages/login';
import { LogoutPage } from './pages/logout';
import { SignUpPage } from './pages/sign-up';
import { ErrorPage } from './pages/error';

export const App = () => {
    return pug`
        ThemeProvider
            ErrorHandler
                AuthProvider
                    Routes
                        Route(path="/" element=${pug`IndexPage`})
                            Route(path="/about" element=${pug`About`})
                            Route(path="/stop/:stop" element=${pug`StopDetails`})
                            Route(path="/review/:stop" element=${pug`ReviewForm`})
                            Route(path="/routes" element=${pug`RouteList`})
                            Route(path="/route/:route" element=${pug`RouteDetails`})
                        Route(path="/agency/:agency" element=${pug`IndexPage`})
                        Route(path="/profile/:username" element=${pug`ProfilePage`})
                        Route(path="/account/login" element=${pug`LoginPage`})
                        Route(path="/account/logout" element=${pug`LogoutPage`})
                        Route(path="/account/sign-up" element=${pug`SignUpPage`})
                        Route(path="*" element=${pug`ErrorPage(status=404, message="Not Found")`})
    `;
};