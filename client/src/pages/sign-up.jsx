import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormWrapper } from '../components/form-wrapper';

export const SignUpPage = () => {
    const navigate = useNavigate();
    
    const handleFormResponse = () => navigate('/');
    
    return pug`
        .form-fullscreen
            h1 Sign up
            FormWrapper(
                action="/api/account/sign-up"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse=handleFormResponse
            )
                p
                    | At this time, community reviews are in private beta.
                    | If you"ve been given an invite code, enter it below to get started.
                fieldset
                    .form-infield
                        label(for="invite") Invitation code
                        input#invite(type="text" name="invite" required)
                fieldset
                    legend Account credentials
                    .form-infield
                        label(for="email") Your email address
                        input#email(type="email" name="email" required)
                    .form-infield
                        label(for="username") Create a username
                        input#username(type="text" name="username" required)
                    .form-infield
                        label(for="password") Create a password
                        input#password(type="password" name="password" minLength="10" required)
                fieldset.button-set
                    button.button-filled.button-primary(type="submit") Submit
    `;
}