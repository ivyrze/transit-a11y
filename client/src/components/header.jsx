import { Link } from 'react-router-dom';
import { MainMenu } from '@components/main-menu';

export const Header = props => {
    const { minimal, children } = props;
    
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
            <MainMenu />
            { children }
        </header>
    )
};