import { Link } from 'react-router-dom';
import { MenuGroup, MenuGroupLabel, MenuItem } from '@ariakit/react';
import { Menu } from '@components/menu';
import { useAuth } from '@hooks/auth';
import { Icon } from '@components/icon';

export const MainMenu = () => {
    const { auth } = useAuth();
    
    return (
        <div id="main-menu">
            <Menu iconName="menu">
                <MenuGroup className="menu-group">
                    <MenuGroupLabel className="menu-group-label">About</MenuGroupLabel>
                    <MenuItem render={
                        <Link
                            to="/about"
                            className="menu-item"
                        >
                            <Icon name="book" />
                            About the project
                        </Link>
                    } />
                    <MenuItem render={
                        <a
                            href="https://ko-fi.com/ivyrze"
                            target="_blank"
                            rel="noopener"
                            className="menu-item"
                        >
                            <Icon name="donation" />
                            Support us on Ko-fi
                        </a>
                    } />
                </MenuGroup>
                <MenuGroup className="menu-group">
                    <MenuGroupLabel className="menu-group-label">View</MenuGroupLabel>
                    <MenuItem render={
                        <Link
                            to="/routes"
                            className="menu-item"
                        >
                            <Icon name="route" />
                            Route explorer
                        </Link>
                    } />
                </MenuGroup>
                <MenuGroup className="menu-group">
                    <MenuGroupLabel className="menu-group-label">User</MenuGroupLabel>
                    { auth && auth.username ? (
                        <>
                            <MenuItem render={
                                <Link
                                    to={ "/profile/" + auth.username }
                                    className="menu-item"
                                >
                                    <Icon name="user" />
                                    Your profile
                                </Link>
                            } />
                            <MenuItem render={
                                <Link
                                    to="/account/logout"
                                    className="menu-item"
                                >
                                    <Icon name="login" />
                                    Logout
                                </Link>
                            } />
                        </>
                    ) : (
                        <MenuItem render={
                            <Link
                                to="/account/login"
                                className="menu-item"
                            >
                                <Icon name="login" />
                                Login
                            </Link>
                        } />
                    ) }
                </MenuGroup>
            </Menu>
        </div>
    );
};