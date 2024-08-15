import React, { forwardRef } from 'react';
import { Select as SelectChild, SelectPopover, SelectProvider } from '@ariakit/react';
import { Icon } from '@components/icon';

import '@assets/styles/components/select.scss';

export const Select = forwardRef((props, ref) => {
    const { store: selectStore, onTouch, valueLabel, children } = props;

    const selectValue = selectStore.useState("value");
    const isOpened = selectStore.useState("open");

    return (
        <SelectProvider store={ selectStore }>
            <SelectChild
                ref={ ref }
                className="select"
                onBlur={ onTouch }
                { ...props }
            >
                { valueLabel(selectValue) }
                <Icon
                    name={ isOpened ? "chevron-up" : "chevron-down" }
                    className="icon--fixed-right"
                />
            </SelectChild>
            <SelectPopover
                className="menu"
                onBlur={ onTouch }
                fitViewport={ true }
                sameWidth
            >
                { children }
            </SelectPopover>
        </SelectProvider>
    );
});