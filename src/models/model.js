
export class Model {
    constructor({ entity = null} = {}) {
        this.entity = entity;
        this.units = [];
    }

    getUnits(index) {
        return this.units[index];
    }

    addUnits(u) {
        this.units.push(u);
    }

    unitsCount() {
        return this.units.length;
    }

    removeUnits(index) {
        this.entity.removeUnitsByIndex(index);
        this.units.splice(index, 1);
    }

    setName(name) {
        this.entity.setName(name);
    }

    name() {
        return this.entity.name();
    }
}

export function createModel(data) {
    return Object.freeze(new Model(data));
}
