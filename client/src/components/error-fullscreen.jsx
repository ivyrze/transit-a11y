import { Header } from "@components/header";
import { Icon } from '@components/icon';

export const ErrorFullscreen = props => {
    let { message, description, status = -1 } = props;
    
    message ??= "App error";
    message = message.replace(/\s(?:([A-Z])[a-z])/g, letter => letter.toLowerCase());
    
    description = (status >= 500) ?
        "Things aren't working as expected on our end, sorry about that. Try again in a few minutes." :
        "Sorry things aren't working as expected! Try heading back to the homepage.";
    
    return (
        <>
            <Header menu={ false } />
            <main className="notice-fullscreen">
                <Icon name="error" />
                <h1>{ message }</h1>
                <p>{ description }</p>
            </main>
        </>
    );
}