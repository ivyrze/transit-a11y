import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';

import './common/style.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    pug`
        React.StrictMode
            BrowserRouter
                App
    `
);