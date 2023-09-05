import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth';
import { FormWrapper } from '@components/form-wrapper';
import { FormSubmit } from '@components/form-submit';
import { FormLabel, FormInput, FormError } from '@ariakit/react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { authRedirect, mutateAuth, setAuthRedirect } = useAuth();
    
    const handleFormResponse = response => {
        navigate(authRedirect ?? '/');
        mutateAuth(response);
        setAuthRedirect();
    };
    
    return (
        <main className="form-fullscreen">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <h1>Login</h1>
            <FormWrapper
                action="/api/account/login"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse={ handleFormResponse }
                defaultValues={{
                    username: '',
                    password: ''
                }}
            >
                <fieldset>
                    <div className="form-infield">
                        <FormLabel name="username">Username</FormLabel>
                        <FormInput name="username" type="text" required />
                        <FormError name="username" />
                    </div>
                    <div className="form-infield">
                        <FormLabel name="password">Password</FormLabel>
                        <FormInput name="password" type="password" required />
                        <FormError name="password" />
                    </div>
                </fieldset>
                <fieldset>
                    <FormSubmit className="button-filled button-primary">Submit</FormSubmit>
                </fieldset>
                <p>Don't have an account? <Link to="/account/sign-up" className="link-regular">Sign up with an invite code</Link>.</p>
            </FormWrapper>
        </main>
    );
};

export default LoginPage;