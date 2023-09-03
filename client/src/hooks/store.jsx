import { create } from 'zustand';

export const useMapStore = create(set => ({
    startupAgency: false,
    setStartupAgency: value => set({ startupAgency: value }),
    flyCoords: false,
    flyTo: value => set({ flyCoords: value }),
    cameraCoords: false,
    setCameraCoords: value => set({ cameraCoords: value }),
    shouldQueryRoutes: false,
    setShouldQueryRoutes: value => set({ shouldQueryRoutes: value }),
    routeList: false,
    setRouteList: value => set({ routeList: value }),
    overriddenStopStyles: {},
    overrideStopStyle: value => set(state => ({
        overriddenStopStyles: { ...state.overriddenStopStyles, ...value }
    })),
    clearOverriddenStopStyles: () => set(() => ({ overriddenStopStyles: {} })),
}));