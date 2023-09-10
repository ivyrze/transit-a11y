import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '@components/link';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, TabList, TabPanel, useTabStore } from '@ariakit/react';
import { useQuery } from '@hooks/query';
import { AccessibilityState } from '@components/accessibility-state';
import { RouteIcon } from '@components/route-icon';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import i18n from '@assets/i18n-strings.json';

import '@assets/styles/components/route-details.scss';

export const RouteDetails = () => {
    const { route } = useParams();
    
    const navigate = useNavigate();
    const tabStore = useTabStore();
    
    const closeCard = () => navigate('/');
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/route-details',
        data: { id: route }
    });
    
    const renderBranch = branch => branch.map((stop, index) => (
        <li key={ stop.id + "-" + index }>
            <AccessibilityState
                className="stop-icon"
                state={ stop.accessibility }
                showHeading={ false }
                showIcon="alt"
            />
            <Link to={ "/stop/" + stop.id } className="link--minimal">{ stop.name }</Link>
        </li>
    ));
    
    return (
        <main className="sidebar-card route-details-card">
            <Helmet>
                <title>{ details.name }</title>
            </Helmet>
            <div className="card__header">
                <h1>{ details.name }</h1>
                <RouteIcon
                    number={ details.number }
                    color={ details.color }
                />
                <div className="card__actions">
                    <Button
                        className="button--rounded"
                        aria-label="Close"
                        onClick={ closeCard }
                    >
                        <Icon name="close" />
                    </Button>
                </div>
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
        </main>
    );
};

export default RouteDetails;