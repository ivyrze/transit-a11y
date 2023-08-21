import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormWrapper } from '../components/form-wrapper';

export const SignUpPage = () => {
    const navigate = useNavigate();
    
    const handleFormResponse = () => navigate('/');
    
    return (
        <div className="form-fullscreen">
            <h1>Sign up</h1>
            <FormWrapper
                action="/api/account/sign-up"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse={ handleFormResponse }
            >
                <p>At this time, community reviews are in private beta. If you"ve been given an invite code, enter it below to get started.</p>
                <fieldset>
                    <div className="form-infield">
                        <label htmlFor="invite">Invitation code</label>
                        <input id="invite" type="text" name="invite" required />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Account credentials</legend>
                    <div className="form-infield">
                        <label htmlFor="email">Your email address</label>
                        <input id="email" type="email" name="email" required />
                    </div>
                    <div className="form-infield">
                        <label htmlFor="username">Create a username</label>
                        <input id="username" type="text" name="username" required />
                    </div>
                    <div className="form-infield">
                        <label htmlFor="password">Create a password</label>
                        <input id="password" type="password" name="password" minLength="10" required />
                    </div>
                </fieldset>
                <fieldset className="button-set">
                    <button className="button-filled button-primary" type="submit">Submit</button>
                </fieldset>
            </FormWrapper>
        </div>
    );
}