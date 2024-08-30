import { seconds } from '$lib/utils';

export const cache = (browserTTL, cdnTTL) => {
    const headerComponents = [
        'public',
        browserTTL && 'max-age=' + seconds(browserTTL),
        cdnTTL && 's-maxage=' + seconds(cdnTTL)
    ].filter(component => component);

    return {
        headers: {
            'Cache-Control': headerComponents.join(', ')
        }
    };
};