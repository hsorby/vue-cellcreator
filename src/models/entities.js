
export class Entity {
    constructor({ name = null, title = null, bgColor = null} = {}) {
        this.name = name;
        this.title = title;
        this.backgroundColor = bgColor;
    }
}

export function createEntity(data) {
    return Object.freeze(new Entity(data));
}
