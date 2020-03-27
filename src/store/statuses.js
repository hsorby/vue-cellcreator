
export const statuses = {
    namespaced: true,
    state: {
        libcellml: false,
    },
    mutations: {
        setLibCellMLReady(state) {
            state.libcellml = true;
        }
    },
};
