
const mutations = {
    loadModel(state, xml) {
        const parser = new this._vm.$libcellml.Parser();
        state.data.push(parser.parseModel(xml));
        state.statuses.push(false);
    },
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
    moveUnits(state, payload) {
        updateModelStatus(state, payload.targetModel);
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        const u = state.data[payload.sourceModel].takeUnitsByIndex(payload.unitsIndex);
        state.data[payload.targetModel].addUnits(u);

    },
    removeUnits(state, payload) {
        updateModelStatus(state, payload.modelIndex);
        state.changed = !state.changed;
        let u = state.data[payload.modelIndex].takeUnitsByIndex(payload.unitsIndex);
        u.delete();
    },
    addNewComponent(state, payload) {
        updateModelStatus(state, payload.targetModel);
        state.changed = !state.changed;
        let componentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
        componentEntity.addComponent(new this._vm.$libcellml.Component());
    },
    addClonedComponent(state, payload) {
        updateModelStatus(state, payload.targetModel);
        state.changed = !state.changed;
        const componentIndex = payload.sourcePath.pop();
        const sourceComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
        let targetComponentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
        const c = sourceComponentEntity.componentByIndex(componentIndex);
        targetComponentEntity.addComponent(c.clone());
    },
    moveComponent(state, payload) {
        updateModelStatus(state, payload.targetModel);
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        const componentIndex = payload.sourcePath.pop();
        let sourceComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
        let targetComponentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
        const c = sourceComponentEntity.takeComponentByIndex(componentIndex);
        targetComponentEntity.addComponent(c);

    },
    removeComponent(state, payload) {
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        const componentIndex = payload.sourcePath.pop();
        let targetComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
        let c = targetComponentEntity.takeComponentByIndex(componentIndex);
        c.delete();
    },
    modelChanged(state, index) {
        updateModelStatus(state, index);
        state.changed = !state.changed;
    },
};

function updateModelStatus(state, index) {
    state.statuses[index] = !state.statuses[index];
}

function getComponentEntity(componentEntity, indexPath) {
    for (let pathIndex = 0; pathIndex < indexPath.length; pathIndex++) {
        componentEntity = componentEntity.componentByIndex(indexPath[pathIndex]);
    }
    return componentEntity;
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
    getComponents: (state) => (index, indexPath) => {
        let components = [];
        let componentEntity = getComponentEntity(state.data[index], indexPath);
        const componentsCount = componentEntity.componentCount();
        for (let componentIndex = 0; componentIndex < componentsCount; componentIndex++) {
            components.push(componentEntity.componentByIndex(componentIndex));
        }
        return components;
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
