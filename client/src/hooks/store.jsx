import { createWithEqualityFn } from 'zustand/traditional';
export { shallow } from 'zustand/shallow';

export const useMapStore = createWithEqualityFn(set => ({
    flyCoords: false,
    flyTo: value => set({ flyCoords: value }),
    overriddenStopStates: {},
    overrideStopState: value => set(state => ({
        overriddenStopStates: { ...state.overriddenStopStates, ...value }
    })),
    clearOverriddenStopStates: () => set(() => ({ overriddenStopStates: {} })),
    openedStopHistory: {},
    setStopOpened: value => set(state => ({
        openedStopHistory: { ...state.openedStopHistory, ...value }
    })),
    clearOpenedStopHistory: () => set(() => ({ openedStopHistory: {} })),
    stopVisibility: [],
    setStopVisibility: value => set({ stopVisibility: value }),
    routeVisibility: [],
    setRouteVisibility: value => set({ routeVisibility: value })
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

export const usePerspectiveStore = createWithEqualityFn(set => ({
    perspective: 'reviews',
    setPerspective: value => set({ perspective: value })
}), Object.is);