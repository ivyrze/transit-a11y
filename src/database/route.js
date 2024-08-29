export const RouteVirtuals = {
    agencyId: {
        needs: { id: true },
        compute: stop => {
            return stop.id.split("-")[0];
        }
    }
};