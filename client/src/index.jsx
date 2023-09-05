import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouterWrapper } from '@components/router-wrapper';
import { routes } from '@generouted/react-router';

import '@assets/styles/style.scss';

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterWrapper />
        <RouterProvider router={ router } future={{ v7_startTransition: true }} />
    </React.StrictMode>
);