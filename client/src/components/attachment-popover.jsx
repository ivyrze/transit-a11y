import React from 'react';
import { Popover, PopoverDisclosure, PopoverHeading, PopoverDescription, PopoverArrow, PopoverDismiss, PopoverProvider, FormInput } from '@ariakit/react';
import cx from 'classnames';

import '@assets/styles/components/popover.scss';

export const AttachmentPopover = props => {
    const { name, alt, isEditing = false } = props;
    
    if (!alt && !isEditing) { return null; }
    
    return (
        <PopoverProvider>
            <PopoverDisclosure
                className="button--overlay attachment__alt"
                aria-haspopup="dialog"
            >
                { isEditing ? "+Alt" : "Alt" }
            </PopoverDisclosure>
            <Popover className="popover">
                <PopoverArrow className="popover__arrow" />
                <PopoverHeading>Image description</PopoverHeading>
                <div className="popover__body">
                    { isEditing ? (
                        <FormInput name={ name } render={
                            <textarea placeholder="Describe the content of your image for other users" />
                        } />
                    ) : (
                        <PopoverDescription>{ alt }</PopoverDescription>
                    ) }
                </div>
                <PopoverDismiss className={
                    cx("button--filled", { "button--primary": isEditing })
                }>
                    { isEditing ? "Done" : "Dismiss" }
                </PopoverDismiss>
            </Popover>
        </PopoverProvider>
    );
};