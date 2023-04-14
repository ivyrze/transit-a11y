import React, { Children, Fragment, cloneElement, isValidElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorStatus } from '../hooks/error';
import { useAuth } from '../hooks/auth';
import { queryHelper } from '../hooks/query';

export const FormWrapper = props => {
    const { onSubmit, onResponse, initialValues, children, ...passthroughProps } = props;
    
    const [ isPending, setIsPending ] = useState(false);
    const [ showValidation, setShowValidation ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const { setErrorStatus } = useErrorStatus();
    const { setAuthRedirect } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async event => {
        event.preventDefault();
        
        if (!event.target.checkValidity()) {
            setShowValidation(true);
            event.target.reportValidity();
            return;
        }
        
        if (isPending) { return; }
        setIsPending(true);
        
        const { action, method } = event.target;
        let data = new FormData(event.target);
        if (onSubmit) {
            onSubmit(data);
        }
        
        let hasFile = false;
        for (const elem of event.target.querySelectorAll('input[type="file"]')) {
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
        
        setIsPending(false);
        setShowValidation(true);
        setErrors(response.data.errors ?? {});
    };
    
    const setInputError = ref => {
        if (ref?.name && errors[ref.name]) {
            ref.setCustomValidity(errors[ref.name]);
            ref.reportValidity();
        }
    };
    
    const clearInputError = event => {
        event.target.setCustomValidity('');
    };
    
    const recurseChildren = children => {
        return Children.map(children, child => {
            if (!isValidElement(child)) {
                return child;
            } else if (child.type === Fragment) {
                return recurseChildren(child.props.children);
            }
            
            if (typeof child.type === "function") {
                child = child.type(child.props);
            }
            
            let injections = {};
            if (child.props?.children) {
                injections.children = recurseChildren(child.props.children);
            }
            
            if ([ 'input', 'textarea', 'select' ].includes(child.type)) {
                injections.ref = setInputError;
                injections.onInput = clearInputError;
            }
            
            if (initialValues && initialValues[child.props?.name]) {
                injections.defaultValue = initialValues[child.props.name];
            }
            
            if (isPending && [ 'button', 'input', 'textarea', 'select' ].includes(child.type)) {
                injections.disabled = 'disabled';
            }
            
            return injections ? cloneElement(child, injections) : child;
        });
    };
    
    return pug`
        form(
            className=showValidation ? "form-validate " : ""
            onSubmit=handleSubmit
            noValidate
            ...passthroughProps
        )
            | ${recurseChildren(children)}
    `;
};