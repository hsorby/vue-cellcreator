
export class Units {
    constructor({ entity = null} = {}) {
        this.entity = entity;
    }
}

export function createUnits(data) {
    return Object.freeze(new Units(data));
}
