import React from 'react';
import { Icon } from './icon';

export const About = props => {
    const { changeCardPresentation } = props;
    
    const closeCard = () => changeCardPresentation({
        action: 'close', card: 'about'
    });
    
    return pug`
        .card-header
            h2 About
            button.card-close(
                aria-label="Close"
                onClick=closeCard
            )
                Icon(name= "close")
        p
            |Decades after the passage of the Americans with Disabilities Act, public
            |transportation still remains largely inaccessible to a population that
            |relies on it most. These barriers push disabled people to their physical
            |and financial limits, yet agencies #[a(href="https://www.nytimes.com/2022/06/22/nyregion/nyc-subway-accessibility-disabilities-elevators.html" target="_blank") such as the New York MTA]
            |still have gone largely unchecked in their discriminatory practices.
        p
            |This app is was designed by Ivy, a wheelchair user, for other wheelchair
            |users and their allies. This project is free and
            |#[a(href="https://github.com/ivyrze/transit-a11y" target="_blank") open-source],
            |so donation contributions are always appreciated.
    `;
};