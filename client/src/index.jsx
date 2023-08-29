import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from '@generouted/react-router';

import '@assets/styles/style.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Routes />
    </React.StrictMode>
);