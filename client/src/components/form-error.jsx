import React, { forwardRef } from 'react';
import { FormError as FormErrorChild, useFormContext } from '@ariakit/react';
import { Icon } from '@components/icon';

import '@assets/styles/components/form-error.scss';

export const FormError = forwardRef((props, ref) => {
    const { name, ...passthroughProps } = props;
    
    const formStore = useFormContext();
    const errorMessage = formStore.useState(state => state.errors[name]);
    const isTouched = formStore.useState(state => state.touched[name]);
    
    if (!errorMessage || !isTouched) { return null; }
    
    return (
        <div className="form-error">
            <Icon name="invalid" />
            <FormErrorChild
                ref={ ref }
                name={ name }
                { ...passthroughProps }
            >
            </FormErrorChild>
        </div>
    );
});