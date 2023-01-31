import React from 'react';
import httpErrors from 'http-errors';
import { Icon } from '../components/icon';

export const ErrorPage = props => {
    let { status } = props;
    
    const title = httpErrors(status).message
        .replace(/\s(?:([A-Z])[a-z])/g, letter => letter.toLowerCase());
    
    const description = (status >= 500) ?
        "Things aren't working as expected on our end, sorry about that. Try again in a few minutes." :
        "Sorry things aren't working as expected! Try heading back to the homepage.";
    
    return pug`
        .notice-fullscreen
            Icon(name= "error")
            h1= title
            p= description
    `;
};