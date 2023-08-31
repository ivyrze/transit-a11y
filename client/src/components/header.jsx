import { Link } from 'react-router-dom';
import { MainMenu } from '@components/main-menu';

export const Header = props => {
    const { minimal, menu = true, children } = props;
    
    return (
        <header className={
            minimal ?
            "global-header header-minimal" :
            "global-header header-regular"
        }>
            <Link
                to="/"
                className="title link-minimal"
            >
                is the metro accessible?
            </Link>
            { menu && <MainMenu /> }
            { children }
        </header>
    )
};