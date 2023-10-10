import attachmentRouter from './routes/attachment.js';
import searchRouter from './routes/search.js';
import stopDetailsRouter from './routes/stop-details.js';
import routeDetailsRouter from './routes/route-details.js';
import routeListRouter from './routes/route-list.js';
import submitReviewRouter from './routes/submit-review.js';
import archiveReviewRouter from './routes/archive-review.js';
import editReviewRouter from './routes/edit-review.js';
import deleteReviewRouter from './routes/delete-review.js';
import mapBoundsRouter from './routes/map-bounds.js';
import mapTilesRouter from './routes/map-tiles.js';
import profileRouter from './routes/profile.js';
import checkAuthRouter from './routes/check-auth.js';
import loginRouter from './routes/account/login.js';
import logoutRouter from './routes/account/logout.js';
import signUpRouter from './routes/account/sign-up.js';

export const routes = {
    '/attachment': {
        router: attachmentRouter
    },
    '/search': {
        router: searchRouter
    },
    '/stop-details': {
        router: stopDetailsRouter
    },
    '/route-details': {
        router: routeDetailsRouter
    },
    '/route-list': {
        router: routeListRouter
    },
    '/submit-review': {
        router: submitReviewRouter,
        auth: 'required'
    },
    '/archive-review': {
        router: archiveReviewRouter,
        auth: 'required'
    },
    '/edit-review': {
        router: editReviewRouter,
        auth: 'required'
    },
    '/delete-review': {
        router: deleteReviewRouter,
        auth: 'required'
    },
    '/map-bounds': {
        router: mapBoundsRouter
    },
    '/map-tiles': {
        router: mapTilesRouter
    },
    '/profile': {
        router: profileRouter
    },
    '/check-auth': {
        router: checkAuthRouter,
        auth: 'optional'
    },
    '/account/login': {
        router: loginRouter,
        auth: 'optional'
    },
    '/account/logout': {
        router: logoutRouter,
        auth: 'optional'
    },
    '/account/sign-up': {
        router: signUpRouter,
        auth: 'optional'
    }
};

export default routes;