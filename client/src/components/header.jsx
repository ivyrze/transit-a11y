import React from 'react';
import cx from 'classnames';
import { MainMenu } from '@components/main-menu';
import { Link } from '@components/link';

import '@assets/styles/components/header.scss';

export const Header = props => {
    const { minimal, menu = true, children } = props;
    
    return (
        <header className={ cx(
            "global-header",
            minimal ? "header-minimal" : "header-regular"
        ) }>
            <Link
                to="/"
                className="title link-minimal"
                currentAware
            >
                is the metro accessible?
            </Link>
            { menu && <MainMenu /> }
            { children }
        </header>
    )
};