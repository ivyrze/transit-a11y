import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '@components/link';
import { useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, useTabStore } from '@ariakit/react';
import { CardClose } from '@components/card-close';
import { useQuery } from '@hooks/query';
import { AccessibilityState } from '@components/accessibility-state';
import { RouteIcon } from '@components/route-icon';
import { useMapStore, shallow } from '@hooks/store';
import i18n from '@assets/i18n-strings.json';

import '@assets/styles/components/route-details.scss';

export const RouteDetails = () => {
    const { route } = useParams();
    
    const tabStore = useTabStore();
    
    const { data: details } = useQuery({
        method: 'post',
        url: '/api/route-details',
        data: { id: route }
    });

    const [
        setStopVisibility,
        setRouteVisibility
    ] = useMapStore(state => [
        state.setStopVisibility,
        state.setRouteVisibility
    ], shallow);
    
    useEffect(() => {
        const stops = details.directions
            .map(direction => direction.segments).flat()
            .map(segment => segment.branches).flat()
            .map(branch => branch.stops).flat()
            .map(relation => relation.stop.id);

        setStopVisibility(stops);
        setRouteVisibility([ route ]);
        
        return () => {
            setStopVisibility([]);
            setRouteVisibility([]);
        }
    }, [ details, setStopVisibility, setRouteVisibility ]);
    
    const renderBranch = branch => branch.stops.map(({ stop }, index) => (
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
                    <CardClose />
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
                            return (segment.branches.length > 1) ? (
                                <div className="branch-set" key={ segmentIndex }>
                                    { segment.branches.map((branch, branchIndex) => (
                                        <div className={ branchIndex == 0 ? "branch-base" : "branch-deviation" } key={ branchIndex }>
                                            { renderBranch(branch) }
                                        </div>
                                    )) }
                                </div>
                            ) : (
                                renderBranch(segment.branches[0])
                            );
                        }) }
                    </ul>
                </TabPanel>
            )) }
        </main>
    );
};

export default RouteDetails;