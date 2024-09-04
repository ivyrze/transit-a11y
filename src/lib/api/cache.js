import { seconds } from '$lib/utils';

export const cache = (browserTTL, cdnTTL, immutable = false) => {
    const headerComponents = [
        'public',
        browserTTL && 'max-age=' + seconds(browserTTL),
        cdnTTL && 's-maxage=' + seconds(cdnTTL),
        immutable && 'immutable'
    ].filter(component => component);

    return {
        headers: {
            'Cache-Control': headerComponents.join(', ')
        }
    };
};