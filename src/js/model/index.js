import libCellML from "@/js/libcellml";

export const uiData = {
    namespaced: true,
    state: {
        cellml: {
            component: {
                backgroundColor: '#4191d6',
            },
            model: {
                backgroundColor: '#42b983',
            },
            variable: {
                backgroundColor: '#e0e24f',
            },
            units: {
                backgroundColor: '#a7a7a7',
            },
        },
        cellMLEntities: [
            {
                name: 'model',
                title: 'Model',
            },
            {
                name: 'component',
                title: 'Comp.',
            },
            {
                name: 'variable',
                title: 'Var.',
            },
            {
                name: 'units',
                title: 'Units',
            }],
        draggingEntity: false,
    },
    mutations: {
        updateDraggingEntity(state, value) {
            state.draggingEntity = value;
        }
    },
    getters: {
        entityStyle: (state) => (entity) => {
            return state.cellml[entity];
        },
        cellMLEntities(state) {
            return state.cellMLEntities;
        },
        draggingEntity(state) {
            return state.draggingEntity;
        }
    },
    actions: {}
};

const modelMutations = {
    addNewUnits(state, index) {
        state.cellMLModels[index].addUnits(new this.state.jsModules.libcellml.Units());
    },
    addClonedUnits(state, payload) {
        const sourceUnits = state.cellMLModels[payload.sourceModel].unitsByIndex(payload.unitsToClone);
        state.cellMLModels[payload.targetModel].addUnits(sourceUnits.clone());
    },
    moveUnits(state, payload) {
        const sourceUnits = state.cellMLModels[payload.sourceModel].takeUnitsByIndex(payload.unitsIndex);
        state.cellMLModels[payload.targetModel].addUnits(sourceUnits);
        console.log(this._vm);
        state.cellMLModels[payload.sourceModel] = state.cellMLModels[payload.sourceModel];
        // this._vm.set(state.cellMLModels, payload.sourceModel, state.cellMLModels[payload.sourceModel]);
        // this._vm.set(state.cellMLModels, payload.targetModel, state.cellMLModels[payload.targetModel]);
    },
};

// Underlying data tracking
export const data = {
    namespaced: true,
    state: {
        libCellMLVersion: 'X.Y.Z',
        cellMLModels: [],
    },
    mutations: {
        setLibCellMLVersion(state, version) {
            state.libCellMLVersion = version;
        },
        addCellMLModel(state) {
            state.cellMLModels.push(new this.state.jsModules.libcellml.Model());
        },
        removeCellMLModel(state, index) {
            state.cellMLModels.splice(index, 1);
        },
        ...modelMutations,
    },
    getters: {
        libCellMLVersion(state) {
            return state.libCellMLVersion
        },
        haveModels(state) {
            return state.cellMLModels.length > 0;
        },
        cellMLModels(state) {
            return state.cellMLModels;
        },
    },
    actions: {}
};

// Modules in use
export const jsModules = {
    namespaced: true,
    state: {
        libcellml: null,
    },
    mutations: {
        setLibCellML(state, module) {
            state.libcellml = module;
        }
    },
    getters: {
        libCellML(state) {
            return state.libcellml;
        }
    },
    actions: {
        load({dispatch, commit}) {
            new libCellML().then((myModule) => {
                commit('setLibCellML', myModule);
                dispatch('moduleReady', {name: 'libcellml'}, {root: true})
            });
        }
    }
};

// Ui state tracking
export const uiState = {
    namespaced: true,
    state: {},
    mutations: {},
    getters: {},
    actions: {}
};
