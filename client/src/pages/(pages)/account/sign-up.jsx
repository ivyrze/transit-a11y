import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FormWrapper } from '@components/form-wrapper';
import { FormSubmit } from '@components/form-submit';
import { FormError } from '@components/form-error';
import { FormLabel, FormInput } from '@ariakit/react';

export const SignUpPage = () => {
    const navigate = useNavigate();
    
    const handleFormResponse = () => navigate('/');
    
    return (
        <main className="form-fullscreen">
            <Helmet>
                <title>Sign up</title>
            </Helmet>
            <h1>Sign up</h1>
            <FormWrapper
                action="/api/account/sign-up"
                method="post"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onResponse={ handleFormResponse }
                defaultValues={{
                    invite: '',
                    email: '',
                    username: '',
                    password: ''
                }}
            >
                <p>At this time, community reviews are in private beta. If you've been given an invite code, enter it below to get started.</p>
                <fieldset>
                    <div className="form-infield">
                        <FormLabel name="invite">Invitation code</FormLabel>
                        <FormInput name="invite" type="text" required />
                        <FormError name="invite" />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Account credentials</legend>
                    <div className="form-infield">
                        <FormLabel name="email">Your email address</FormLabel>
                        <FormInput name="email" type="email" required />
                        <FormError name="email" />
                    </div>
                    <div className="form-infield">
                        <FormLabel name="username">Create a username</FormLabel>
                        <FormInput name="username" type="text" required />
                        <FormError name="username" />
                    </div>
                    <div className="form-infield">
                        <FormLabel name="password">Create a password</FormLabel>
                        <FormInput name="password" type="password" minLength="10" required />
                        <FormError name="password" />
                    </div>
                </fieldset>
                <fieldset className="button-set">
                    <FormSubmit className="button--filled button--primary">Submit</FormSubmit>
                </fieldset>
            </FormWrapper>
        </main>
    );
};

export default SignUpPage;