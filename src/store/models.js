
function prepareForStateUpdate(state, payload, update) {
    if (update.source) {
        updateModelStatus(state, payload.sourceModel);
    }
    if (update.target) {
        updateModelStatus(state, payload.targetModel);
    }
    state.changed = !state.changed;
    let sourceComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
    let targetComponentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
    return {sourceComponentEntity, targetComponentEntity};
}

const mutations = {
    loadModel(state, xml) {
        const parser = new this._vm.$libcellml.Parser();
        state.data.push(parser.parseModel(xml));
        state.statuses.push(false);
    },
    addModel(state, index) {
        console.log(typeof index);
        if (index === '') {
            state.data.push(new this._vm.$libcellml.Model());
        } else {
            state.data.push(state.data[index].clone());
        }
        state.statuses.push(false);
    },
    removeModel(state, index) {
        console.log(typeof index);
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
        const componentIndex = payload.sourcePath.pop();
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: false, target: true});
        const c = sourceComponentEntity.componentByIndex(componentIndex);
        targetComponentEntity.addComponent(c.clone());
    },
    moveComponent(state, payload) {
        const componentIndex = payload.sourcePath.pop();
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: true, target: true});
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
    addNewVariable(state, payload) {
        updateModelStatus(state, payload.targetModel);
        state.changed = !state.changed;
        let componentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
        componentEntity.addVariable(new this._vm.$libcellml.Variable());
    },
    addClonedVariable(state, payload) {
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: false, target: true});
        const v = sourceComponentEntity.variableByIndex(payload.index);
        targetComponentEntity.addVariable(v.clone());
    },
    moveVariable(state, payload) {
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: true, target: true});
        const v = sourceComponentEntity.takeVariableByIndex(payload.index);
        targetComponentEntity.addVariable(v);
    },
    removeVariable(state, payload) {
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        let targetComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
        let v = targetComponentEntity.takeVariableByIndex(payload.index);
        v.delete();
    },
    addNewReset(state, payload) {
        updateModelStatus(state, payload.targetModel);
        state.changed = !state.changed;
        let componentEntity = getComponentEntity(state.data[payload.targetModel], payload.targetPath);
        componentEntity.addReset(new this._vm.$libcellml.Reset());
    },
    addClonedReset(state, payload) {
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: false, target: true});
        const r = sourceComponentEntity.resetByIndex(payload.index);
        targetComponentEntity.addReset(r.clone());
    },
    moveReset(state, payload) {
        let {sourceComponentEntity, targetComponentEntity} = prepareForStateUpdate(state, payload, {source: true, target: true});
        const r = sourceComponentEntity.takeResetByIndex(payload.index);
        targetComponentEntity.addReset(r);
    },
    removeReset(state, payload) {
        updateModelStatus(state, payload.sourceModel);
        state.changed = !state.changed;
        let targetComponentEntity = getComponentEntity(state.data[payload.sourceModel], payload.sourcePath);
        let v = targetComponentEntity.takeResetByIndex(payload.index);
        v.delete();
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
    getUnitsAt: (state) => (modelIndex, unitsIndex) => {
        return state.data[modelIndex].unitsByIndex(unitsIndex);
    },
    getComponents: (state) => (index, indexPath) => {
        let components = [];
        let componentEntity = getComponentEntity(state.data[index], indexPath);
        const componentCount = componentEntity.componentCount();
        for (let componentIndex = 0; componentIndex < componentCount; componentIndex++) {
            components.push(componentEntity.componentByIndex(componentIndex));
        }
        return components;
    },
    getVariables: (state) => (index, indexPath) => {
        let variables = [];
        let componentEntity = getComponentEntity(state.data[index], indexPath);
        const variableCount = componentEntity.variableCount();
        for (let variableIndex = 0; variableIndex < variableCount; variableIndex++) {
            variables.push(componentEntity.variableByIndex(variableIndex));
        }
        return variables;
    },
    getResets: (state) => (index, indexPath) => {
        let resets = [];
        let componentEntity = getComponentEntity(state.data[index], indexPath);
        const resetCount = componentEntity.resetCount();
        for (let resetIndex = 0; resetIndex < resetCount; resetIndex++) {
            resets.push(componentEntity.resetByIndex(resetIndex));
        }
        return resets;
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
