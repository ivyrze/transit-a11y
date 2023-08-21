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
    return (
        <ThemeProvider>
            <ErrorHandler>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={ <IndexPage /> }>
                            <Route path="/about" element={ <About /> } />
                            <Route path="/stop/:stop" element={ <StopDetails /> } />
                            <Route path="/review/:stop" element={ <ReviewForm /> } />
                            <Route path="/routes" element={ <RouteList /> } />
                            <Route path="/route/:route" element={ <RouteDetails /> } />
                        </Route>
                        <Route path="/agency/:agency" element={ <IndexPage /> } />
                        <Route path="/profile/:username" element={ <ProfilePage /> } />
                        <Route path="/account/login" element={ <LoginPage /> } />
                        <Route path="/account/logout" element={ <LogoutPage /> } />
                        <Route path="/account/sign-up" element={ <SignUpPage /> } />
                        <Route path="*" element={ <ErrorPage status={ 404 } message="Not Found" /> } />
                    </Routes>
                </AuthProvider>
            </ErrorHandler>
        </ThemeProvider>
    );
};