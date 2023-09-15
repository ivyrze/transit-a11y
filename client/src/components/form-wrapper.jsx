import React, { useRef } from 'react';
import { Form, FormProvider, useFormStore } from '@ariakit/react';
import { useNavigate } from 'react-router-dom';
import { useFormWrapperStore } from '@hooks/store';
import { useErrorStatus } from '@hooks/error';
import { useAuth } from '@hooks/auth';
import { queryHelper } from '@hooks/query';

import '@assets/styles/components/form-wrapper.scss';

export const FormWrapper = props => {
    const { action, method, onSubmit, onResponse, defaultValues, children, ...passthroughProps } = props;
    
    const formStore = useFormStore({ defaultValues });
    const formRef = useRef();
    
    const setIsLoading = useFormWrapperStore(state => state.setIsLoading);
    
    const { setErrorStatus } = useErrorStatus();
    const { setAuthRedirect } = useAuth();
    const navigate = useNavigate();
    
    formStore.useSubmit(async () => {
        setIsLoading(true);
        
        let data = new FormData(formRef.current);
        if (onSubmit) {
            onSubmit(data);
        }
        
        let hasFile = false;
        for (const elem of formRef.current.querySelectorAll('input[type="file"]')) {
            if (elem.files.length) {
                hasFile = true;
            } else {
                data.delete(elem.name);
            }
        }
        
        if (!hasFile) {
            data = new URLSearchParams(data);
        }
        
        const response = await queryHelper({
            url: action, method, data, validateStatus: status => status <= 401
        }, setErrorStatus);
        
        if (response.status === 401) {
            navigate("/account/login");
            setAuthRedirect(-1);
        } else if (response.status < 400 && !response.data.errors) {
            if (onResponse) {
                onResponse(response.data);
            }
        }
        
        setIsLoading(false);
        
        if (response.data?.errors) {
            formStore.setErrors(response.data.errors);
        }
    });
    
    return (
        <FormProvider store={ formStore }>
            <Form
                ref={ formRef }
                { ...passthroughProps }
            >
                { children }
            </Form>
        </FormProvider>
    );
};