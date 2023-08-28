import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Tab, TabList, TabPanel, useTabStore } from '@ariakit/react';
import { useQuery } from '../hooks/query';
import { AccessibilityState } from './accessibility-state';
import { RouteIcon } from './route-icon';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const RouteDetails = props => {
    const { route } = useParams();
    
    const navigate = useNavigate();
    const tabStore = useTabStore();
    
    const closeCard = () => navigate('/');
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/route-details',
        data: { id: route }
    });
    
    if (!details) { return; }
    
    const renderBranch = branch => branch.map((stop, index) => (
        <li key={ stop.id + "-" + index }>
            <AccessibilityState
                className="stop-icon"
                state={ stop.accessibility }
                showHeading={ false }
                showIcon="alt"
            />
            <Link to={ "/stop/" + stop.id } className="link-minimal">{ stop.name }</Link>
        </li>
    ));
    
    return (
        <div className="sidebar-card route-details-card">
            <div className="card-header">
                <h2>
                    { details.name }
                    <RouteIcon
                        number={ details.number }
                        color={ details.color }
                    />
                </h2>
                <button
                    className="button-rounded card-close"
                    aria-label="Close"
                    onClick={ closeCard }
                >
                    <Icon name="close" />
                </button>
            </div>
            <span className="subtitle">
                { i18n.routeSubheadings[details.agency.vehicle] }
            </span>
            <TabList className="tab-group" store={ tabStore }>
                { details.directions.map((direction, directionIndex) => (
                    <Tab key={ directionIndex }>
                        { i18n.directionHeadings[direction.heading] }
                    </Tab>
                )) }
            </TabList>
            { details.directions.map((direction, directionIndex) => (
                <TabPanel store={ tabStore } key={ directionIndex }>
                    <ul className="stop-list-tree">
                        { direction.segments.map((segment, segmentIndex) => {
                            return (segment.length > 1) ? (
                                <div className="branch-set" key={ segmentIndex }>
                                    { segment.map((branch, branchIndex) => (
                                        <div className={ branchIndex == 0 ? "branch-base" : "branch-deviation" } key={ branchIndex }>
                                            { renderBranch(branch) }
                                        </div>
                                    )) }
                                </div>
                            ) : (
                                renderBranch(segment[0])
                            );
                        }) }
                    </ul>
                </TabPanel>
            )) }
        </div>
    );
}