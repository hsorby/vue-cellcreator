
const mutations = {
    addModel(state) {
        state.data.push(new this._vm.$libcellml.Model());
        state.statuses.push(false);
    },
    removeModel(state, index) {
        let m = state.data[index];
        state.data.splice(index, 1);
        state.statuses.splice(index, 1);
        m.delete();
    },
    addNewUnits(state, index) {
        updateModelStatus(state, index);
        state.changed = !state.changed;
        state.data[index].addUnits(new this._vm.$libcellml.Units());
    },
    addClonedUnits(state, payload) {
        updateModelStatus(state, payload.targetModel);
        state.changed = !state.changed;
        const u = state.data[payload.sourceModel].unitsByIndex(payload.unitsToClone);
        state.data[payload.targetModel].addUnits(u.clone());
    },
    removeUnits(state, payload) {
        updateModelStatus(state, payload.modelIndex);
        state.changed = !state.changed;
        let u = state.data[payload.modelIndex].takeUnitsByIndex(payload.unitsIndex);
        u.delete();
    },
    moveUnits(state, payload) {
        updateModelStatus(state, payload.targetModel);
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        const u = state.data[payload.sourceModel].takeUnitsByIndex(payload.unitsIndex);
        state.data[payload.targetModel].addUnits(u);

    },
};

function updateModelStatus(state, index) {
    state.statuses[index] = !state.statuses[index];
}


const getters = {
    getModel: (state) => (index) => {
        return state.data[index];
    },
    getModels: (state) => {
        return state.data;
    },
    modelsCount: (state) => {
        return state.data.length;
    },
    getUnits: (state) => (index) => {
        let units = [];
        const unitsCount = state.data[index].unitsCount();
        for (let unitsIndex = 0; unitsIndex < unitsCount; unitsIndex++) {
            units.push(state.data[index].unitsByIndex(unitsIndex));
        }
        return units;
    },
    changed: (state) => {
        return state.changed;
    },
    getStatus: (state) => (index) => {
        return state.statuses[index];
    }
};

const state = () => ({
    data: [],
    statuses: [],
    changed: false,
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
