import React, { Children, Fragment, cloneElement, isValidElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorStatus } from '../hooks/error';
import { queryHelper } from '../hooks/query';

export const FormWrapper = props => {
    const { onResponse, children, ...passthroughProps } = props;
    
    const [ hasSubmitted, setSubmitted ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const { setErrorStatus } = useErrorStatus();
    const navigate = useNavigate();
    
    const handleSubmit = async event => {
        event.preventDefault();
        
        const { action, method } = event.target;
        const data = new URLSearchParams(new FormData(event.target));
        
        const response = await queryHelper({
            url: action, method, data, validateStatus: status => status <= 401
        }, setErrorStatus);
        
        if (response.status === 401) {
            navigate("/account/login");
        } else if (response.status < 400 && !response.data.errors) {
            if (onResponse) {
                onResponse(response.data);
            }
        }
        
        setSubmitted(true);
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
            
            let injections = {};
            if (child.props?.children) {
                injections.children = recurseChildren(child.props.children);
            }
            
            if ([ 'input', 'textarea', 'select' ].includes(child.type)) {
                injections.ref = setInputError;
                injections.onInput = clearInputError;
            }
            
            return injections ? cloneElement(child, injections) : child;
        });
    };
    
    return pug`
        form#test(
            className=hasSubmitted ? "form-submitted" : ""
            onSubmit=handleSubmit
            ...passthroughProps
        )
            | ${recurseChildren(children)}
    `;
};