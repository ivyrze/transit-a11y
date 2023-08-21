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
    
    const renderBranch = branch => branch.map((stop, index) => (
        <li key={ stop.id + "-" + index }>
            <span className="stop-icon">
                <Icon name={ i18n.accessibilityStates[stop.accessibility].style } alt={ true } />
            </span>
            <Link to={ "/stop/" + stop.id }>{ stop.name }</Link>
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
            <div className="tab-group" role="tablist">
                { details.directions.map((direction, directionIndex) => {
                    return currentDirection == directionIndex ? (
                        <button
                            className="active"
                            key={ directionIndex }
                            role="tab"
                            aria-selected="true"
                            onClick={ () => setCurrentDirection(directionIndex) }
                        >
                            { i18n.directionHeadings[direction.heading] }
                        </button>
                    ) : (
                        <button
                            key={ directionIndex }
                            role="tab"
                            aria-selected="false"
                            onClick={ () => setCurrentDirection(directionIndex) }
                        >
                            { i18n.directionHeadings[direction.heading] }
                        </button>
                    );
                }) }
            </div>
            <ul className="stop-list-tree">
                { details.directions[currentDirection].segments.map((segment, segmentIndex) => {
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
        </div>
    );
}