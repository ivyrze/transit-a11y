import { ErrorFullscreen } from "@components/error-fullscreen";

export const NotFoundPage = () => {
    return <ErrorFullscreen message="Not found" status={ 404 } />;
};

export default NotFoundPage;