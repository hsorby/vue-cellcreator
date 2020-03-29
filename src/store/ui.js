
import { createEntity } from '@/models/entities';

const modelEntity = createEntity({
    name: 'model',
    title: 'Model',
    bgColor: '#42b983',
});
const unitsEntity = createEntity({
    name: 'units',
    title: 'Units',
    bgColor: '#a7a7a7',
});
const componentEntity = createEntity({
    name: 'component',
    title: 'Comp.',
    bgColor: '#4191d6',
});

const variableEntity = createEntity({
    name: 'variable',
    title: 'Var.',
    bgColor: '#e0e24f',
});

export const ui = {
    namespaced: true,
    state: {
        draggingEntity: false,
        movingEntity: false,
        entities: [modelEntity, unitsEntity, componentEntity, variableEntity],
    },
    mutations: {
        updateDraggingEntity(state, value) {
            state.draggingEntity = value;
        },
        setMovingEntity(state, value) {
            state.movingEntity = value;
        },
    },
    getters: {
        draggingEntity(state) {
            return state.draggingEntity;
        },
        movingEntity(state) {
            return state.movingEntity;
        },
        cellMLEntities(state) {
            return state.entities;
        },
        cellMLEntityStyle: (state) => (name) => {
            let result = state.entities.filter(obj => {
                return obj.name === name
            });
            return result[0];
        },
    },
    actions: {}
};
