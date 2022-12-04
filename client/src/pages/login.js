import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormWrapper } from '../components/form-wrapper';

export const LoginPage = () => {
    const navigate = useNavigate();
    
    const handleFormResponse = () => navigate('/');
    
    return pug`
        .form-fullscreen
            h1 Login
            FormWrapper(
                action="/api/account/login"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse=handleFormResponse
            )
                fieldset
                    .form-infield
                        label(for="username") Username
                        input#username(type="text" name="username" required)
                    .form-infield
                        label(for="password") Password
                        input#password(type="password" name="password" required)
                fieldset
                    button.button-filled.button-primary(type="submit") Submit
                p
                    | Don"t have an account?
                    | #[Link(to="/account/sign-up") Sign up with an invite code].
    `;
}