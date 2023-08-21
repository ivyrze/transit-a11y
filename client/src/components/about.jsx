import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './icon';

export const About = () => {
    const navigate = useNavigate();
    
    const closeCard = () => navigate('/');
    
    return (
        <div className="sidebar-card about-card">
            <div className="card-header">
                <h2>About</h2>
                <button
                    className="button-rounded card-close"
                    aria-label="Close"
                    onClick={ closeCard }
                >
                    <Icon name= "close" />
                </button>
            </div>
            <p>Decades after the passage of the Americans with Disabilities Act, public transportation still remains largely inaccessible to a population that relies on it most. These barriers push disabled people to their physical and financial limits, yet agencies <a href="https://www.nytimes.com/2022/06/22/nyregion/nyc-subway-accessibility-disabilities-elevators.html" target="_blank">such as the New York MTA</a> still have gone largely unchecked in their discriminatory practices.</p>
            <p>This app is was designed by Ivy, a wheelchair user, for other wheelchair users and their allies. This project is free and <a href="https://github.com/ivyrze/transit-a11y" target="_blank">open-source</a>, so donation contributions are always appreciated.</p>
        </div>
    );
};