import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { wrapRouter } from "oaf-react-router";
import { routes } from '@generouted/react-router';

import '@assets/styles/style.scss';

const router = createBrowserRouter(routes);
wrapRouter(router, {
    documentTitle: () => {
        const titleComponents = document.title.split(" | ");
        return titleComponents.length > 1 ? titleComponents[0] : "Home";
    },
    navigationMessage: title => "Navigated to " + title,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={ router } future={{ v7_startTransition: true }} />
    </React.StrictMode>
);