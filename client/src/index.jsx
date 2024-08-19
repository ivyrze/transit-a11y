import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouterWrapper } from '@components/router-wrapper';
import { routes } from '@generouted/react-router';

import '@assets/styles/style.scss';

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <RouterWrapper />
            <RouterProvider router={ router } future={{ v7_startTransition: true }} />
        </HelmetProvider>
    </React.StrictMode>
);