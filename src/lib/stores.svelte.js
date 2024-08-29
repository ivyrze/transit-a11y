import { browser } from "$app/environment";
import { goto } from '$app/navigation';

const createAuth = () => {
    let username = $state();
    let role = $state();
    let redirect = $state(false);

    return {
        get username() { return username; },
        get role() { return role; },
        set redirect(value) { redirect = value; },
        login() {
            goto(redirect ? redirect : '/');
            redirect = false;
        },
        update(updatedAuth) {
            username = updatedAuth.username;
            role = updatedAuth.role;
        },
        clear() {
            username = undefined;
            role = undefined;
        }
    };
};

export const authStore = createAuth();

const checkBrowserTheme = () => {
    if (!browser) { return; }
    return window.matchMedia('(prefers-color-scheme: light)');
};

const createTheme = () => {
    let theme = $state(checkBrowserTheme()?.matches);

    return {
        get isLight() { return theme; },
        set isLight(value) { theme = value; }
    }
};

export const themeStore = createTheme();
checkBrowserTheme()?.addEventListener('change', event => {
    themeStore.isLight = event.matches;
});

const createPerspective = () => {
    let perspective = $state('reviews');

    return {
        get perspective() { return perspective; },
        set perspective(value) { perspective = value; }
    };
};

export const perspectiveStore = createPerspective();

const createMap = () => {
    let map = $state();
    let isLoaded = $state(false);
    let geolocateControl = $state();
    let stopVisibility = $state([]);
    let routeVisibility = $state([]);
    let overriddenStopStates = $state({});

    return {
        get map() { return map; },
        set map(value) { map = value; },
        get isLoaded() { return isLoaded; },
        set isLoaded(value) { isLoaded = value; },
        get geolocateControl() { return geolocateControl; },
        set geolocateControl(value) { geolocateControl = value; },
        get stopVisibility() { return stopVisibility; },
        set stopVisibility(value) { stopVisibility = value; },
        get routeVisibility() { return routeVisibility; },
        set routeVisibility(value) { routeVisibility = value; },
        get overriddenStopStates() { return overriddenStopStates; },
        overrideStopState(key, value) { overriddenStopStates[key] = value; }
    };
};

export const mapStore = createMap();

export const createForm = () => {
    let errors = $state([]);
    let isLoading = $state(false);

    return {
        get errors() { return errors; },
        set errors(value) { errors = value; },
        get isLoading() { return isLoading; },
        set isLoading(value) { isLoading = value; }
    };
};