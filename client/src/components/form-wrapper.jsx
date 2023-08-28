import React, { createContext, useContext, useRef } from 'react';
import { Form, useFormStore } from '@ariakit/react';
import { useNavigate } from 'react-router-dom';
import { useErrorStatus } from '@hooks/error';
import { useAuth } from '@hooks/auth';
import { queryHelper } from '@hooks/query';

const FormContext = createContext();

export const FormWrapper = props => {
    const { action, method, onSubmit, onResponse, defaultValues, children, ...passthroughProps } = props;
    
    const formStore = useFormStore({ defaultValues });
    const formRef = useRef();
    
    const { setErrorStatus } = useErrorStatus();
    const { setAuthRedirect } = useAuth();
    const navigate = useNavigate();
    
    formStore.useSubmit(async () => {
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
        
        if (response.data?.errors) {
            formStore.setErrors(response.data.errors);
        }
    });
    
    return (
        <FormContext.Provider value={ formStore }>
            <Form
                store={ formStore }
                ref={ formRef }
                { ...passthroughProps }
            >
                { children }
            </Form>
        </FormContext.Provider>
    );
};

export const useFormContext = () => useContext(FormContext);