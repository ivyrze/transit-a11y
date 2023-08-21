import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { FormWrapper } from '../components/form-wrapper';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { authRedirect, setAuth, setAuthRedirect } = useAuth();
    
    const handleFormResponse = response => {
        navigate(authRedirect ?? '/');
        setAuth(response);
        setAuthRedirect();
    };
    
    return (
        <div className="form-fullscreen">
            <h1>Login</h1>
            <FormWrapper
                action="/api/account/login"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse={ handleFormResponse }
            >
                <fieldset>
                    <div className="form-infield">
                        <label htmlFor="username">Username</label>
                        <input id="username" type="text" name="username" required />
                    </div>
                    <div className="form-infield">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" required />
                    </div>
                </fieldset>
                <fieldset>
                    <button className="button-filled button-primary" type="submit">Submit</button>
                </fieldset>
                <p>Don't have an account? <Link to="/account/sign-up">Sign up with an invite code</Link>.</p>
            </FormWrapper>
        </div>
    );
}