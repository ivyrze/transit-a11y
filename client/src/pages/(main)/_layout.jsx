import React, { useRef, useCallback } from 'react';
import { MenuGroup, MenuGroupLabel, MenuItem } from '@ariakit/react';
import { Menu } from '@components/menu';
import { Link, Outlet } from 'react-router-dom';
import { Search } from '@components/search';
import { Map } from '@components/map';
import { Icon } from '@components/icon';
import { useAuth } from '@hooks/auth';

import 'mapbox-gl/dist/mapbox-gl.css';

export const IndexPage = () => {
    const title = 'is the metro accessible?';
    
    const { auth } = useAuth();
    const map = useRef();
    
    const handleGeolocationTrigger = useCallback(() => {
        return map.current?.triggerGeolocation()
    }, []);
    
    return (
        <>
            <div id="sidebar-container">
                <h1 className="title">
                    { title }
                </h1>
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
                                    Show nearby routes
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
                                            View profile
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
                <Search
                    onGeolocationTriggered={ handleGeolocationTrigger }
                />
                <Outlet />
            </div>
            <Map ref={ map } />
        </>
    );
};

export default IndexPage;