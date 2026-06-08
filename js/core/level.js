import { Entity } from "./entities/entity.js";
import { camera } from "../main.js";

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
        if (!(entity instanceof Entity)) return;
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

    render() {
        this.entities.forEach(entity => {
            const x = entity.position.x - camera.position.x;
            const y = entity.position.y - camera.position.y;

            entity.elem.style.transform =
                `translate(${x}px, ${y}px) scaleX(${entity.components.direction ?? 1})`;
        });
    }

    update(dt) {
        this.systems.forEach((system) => system(this.entities, dt));

        this.entities.forEach((entity) => {
            if (entity.update) entity.update(entity, dt);
        });

        this.render();
    }
}
