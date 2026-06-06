import { Entity } from "./entities/entity.js";
export class Level {
    #parentElement = document.body;

    entities = [];
    systems = [];

    dimensions = {
        height: 0,
        width: 0
    };

    constructor(dimensions = { height: 0, width: 0 }) {
        this.dimensions = dimensions;
    }

    addEntity(entity) {
        if (!(entity instanceof Entity)) {
            console.error(`${entity} is not an instance of Entity`);
            return;
        }

        this.entities.push(entity);
    }

    addSystem(system) {
        this.systems.push(system);
    }

    setParent(parent = document.body) {
        this.#parentElement = parent;
    }

    mountEntities() {
        this.entities.forEach((entity) => {
            this.#parentElement.appendChild(entity.elem);
        });
    }

    update(dt) {
        this.systems.forEach((system) => {
            system(this.entities, dt);
        });

        this.entities.forEach((entity) => {
            if (entity.update) {
                entity.update(entity, dt);
            }
        });

    }
}