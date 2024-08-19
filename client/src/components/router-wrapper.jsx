import { Helmet } from 'react-helmet-async';
import { announce, focusElement, elementFromTarget } from 'oaf-side-effects';

export const RouterWrapper = () => {
    const focusTargetSelector = "main h1, [role=main] h1";
    
    const documentTitle = title => {
        const titleComponents = title.split(" | ");
        return titleComponents.length > 1 ? titleComponents[0] : "Home";
    };
    
    const navigationMessage = title => "Navigated to " + title;
    
    const onChangeClientState = newState => {
        const focusTarget = elementFromTarget(focusTargetSelector);
        if (focusTarget) {
            focusElement(focusTarget);
        }
        
        announce(navigationMessage(documentTitle(newState.title)));
    };
    
    return (
        <Helmet onChangeClientState={ onChangeClientState } />
    );
};

export default RouterWrapper;