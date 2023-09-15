import React, { forwardRef } from 'react';
import { useFormWrapperStore } from '@hooks/store';
import { FormSubmit as FormSubmitChild } from '@ariakit/react';
import { Icon } from '@components/icon';

export const FormSubmit = forwardRef((props, ref) => {
    const isLoading = useFormWrapperStore(state => state.isLoading);
    
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