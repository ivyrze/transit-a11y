import { createWithEqualityFn } from 'zustand/traditional';
export { shallow } from 'zustand/shallow';

export const useMapStore = createWithEqualityFn(set => ({
    flyCoords: false,
    flyTo: value => set({ flyCoords: value }),
    shouldQueryRoutes: false,
    setShouldQueryRoutes: value => set({ shouldQueryRoutes: value }),
    routeList: false,
    setRouteList: value => set({ routeList: value }),
    overriddenStopStyles: {},
    overrideStopStyle: value => set(state => ({
        overriddenStopStyles: { ...state.overriddenStopStyles, ...value }
    })),
    clearOverriddenStopStyles: () => set(() => ({ overriddenStopStyles: {} })),
    openedStopHistory: {},
    setStopOpened: value => set(state => ({
        openedStopHistory: { ...state.openedStopHistory, ...value }
    })),
    clearOpenedStopHistory: () => set(() => ({ openedStopHistory: {} }))
}), Object.is);

export const useFormWrapperStore = createWithEqualityFn(set => ({
    isLoading: false,
    setIsLoading: value => set({ isLoading: value }),
    files: {},
    setFiles: (key, value) => set(state => ({
        files: { ...state.files, [key]: value }
    })),
    clearFiles: key => set(state => {
        delete state.files[key];
        return { files: state.files };
    })
}), Object.is);