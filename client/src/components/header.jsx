import { NavLink } from 'react-router-dom';
import { MainMenu } from '@components/main-menu';

export const Header = props => {
    const { minimal, menu = true, children } = props;
    
    return (
        <header className={
            minimal ?
            "global-header header-minimal" :
            "global-header header-regular"
        }>
            <NavLink
                to="/"
                className="title link-minimal"
            >
                is the metro accessible?
            </NavLink>
            { menu && <MainMenu /> }
            { children }
        </header>
    )
};