import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '../hooks/query';
import { RouteIcon } from './route-icon';
import { Icon } from './icon';
import i18n from '../i18n-strings.json';

export const RouteDetails = props => {
    const { route } = useParams();
    
    const [ currentDirection, setCurrentDirection ] = useState(0);
    const navigate = useNavigate();
    
    const closeCard = () => navigate('/');
    
    const details = useQuery({
        method: 'post',
        url: '/api/route-details',
        data: { id: route }
    })?.data;
    
    if (!details) { return; }
    
    const renderBranch = branch => pug`
        for stop, index in branch
            li(key=stop.id + "-" + index)
                span.stop-icon(
                    className="state-" + i18n.accessibilityStates[stop.accessibility].style
                )
                Link(to="/stop/" + stop.id)= stop.name
    `;
    
    return pug`
        .sidebar-card.route-details-card
            .card-header
                h2= details.name
                    RouteIcon(
                        number=details.number
                        color=details.color
                    )
                button.button-rounded.card-close(
                    aria-label="Close"
                    onClick=closeCard
                )
                    Icon(name= "close")
            span.subtitle= i18n.routeSubheadings[details.agency.vehicle]
            .tab-group(role="tablist")
                for direction, directionIndex in details.directions
                    if currentDirection == directionIndex
                        button.active(
                            key=directionIndex
                            role="tab"
                            aria-selected="true"
                            onClick=() => setCurrentDirection(directionIndex)
                        )= i18n.directionHeadings[direction.heading]
                    else
                        button(
                            key=directionIndex
                            role="tab"
                            aria-selected="false"
                            onClick=() => setCurrentDirection(directionIndex)
                        )= i18n.directionHeadings[direction.heading]
            ul.stop-list-tree
                for segment, segmentIndex in details.directions[currentDirection].segments
                    if segment.length > 1
                        .branch-set(key=segmentIndex)
                            for branch, branchIndex in segment
                                if branchIndex == 0
                                    .branch-base(key=branchIndex)
                                        | #{renderBranch(branch)}
                                else
                                    .branch-deviation(key=branchIndex)
                                        | #{renderBranch(branch)}
                    else 
                        | #{renderBranch(segment[0])}
    `;
}