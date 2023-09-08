import { NavLink } from 'react-router-dom';
import { MenuGroup, MenuGroupLabel, MenuItem } from '@ariakit/react';
import { Menu } from '@components/menu';
import { useAuth } from '@hooks/auth';
import { Icon } from '@components/icon';

export const MainMenu = () => {
    const { auth } = useAuth();
    
    return (
        <div id="main-menu">
            <Menu iconName="menu" toggleAriaLabel="Toggle main menu">
                <MenuGroup className="menu-group">
                    <MenuGroupLabel className="menu-group-label">About</MenuGroupLabel>
                    <MenuItem render={
                        <NavLink
                            to="/about"
                            className="menu-item"
                        >
                            <Icon name="book" />
                            About the project
                        </NavLink>
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
                        <NavLink
                            to="/routes"
                            className="menu-item"
                        >
                            <Icon name="route" />
                            Route explorer
                        </NavLink>
                    } />
                </MenuGroup>
                <MenuGroup className="menu-group">
                    <MenuGroupLabel className="menu-group-label">User</MenuGroupLabel>
                    { auth && auth.username ? (
                        <>
                            <MenuItem render={
                                <NavLink
                                    to={ "/profile/" + auth.username }
                                    className="menu-item"
                                >
                                    <Icon name="user" />
                                    Your profile
                                </NavLink>
                            } />
                            <MenuItem render={
                                <NavLink
                                    to="/account/logout"
                                    className="menu-item"
                                >
                                    <Icon name="login" />
                                    Logout
                                </NavLink>
                            } />
                        </>
                    ) : (
                        <MenuItem render={
                            <NavLink
                                to="/account/login"
                                className="menu-item"
                            >
                                <Icon name="login" />
                                Login
                            </NavLink>
                        } />
                    ) }
                </MenuGroup>
            </Menu>
        </div>
    );
};