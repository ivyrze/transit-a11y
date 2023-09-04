import React, { forwardRef } from 'react';
import { useFormContext } from '@components/form-wrapper';
import { FormSubmit as FormSubmitChild } from '@ariakit/react';
import { Icon } from '@components/icon';

export const FormSubmit = forwardRef((props, ref) => {
    const { isLoading } = useFormContext();
    
    return (
        <FormSubmitChild
            ref={ ref }
            disabled={ isLoading }
            { ...isLoading && { 'aria-label': 'Loading...' } }
            { ...props }
        >
            { !isLoading ? "Submit" : <Icon name="spinner" /> }
        </FormSubmitChild>
    );
});