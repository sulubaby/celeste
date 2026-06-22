import { mainLevel } from "../main.js";
import { Entity } from "./entity.js";

export function createGhost(entity, spriteSheet) {

    const ghost = new Entity(
        {
            x: entity.position.x,
            y: entity.position.y
        },
        {
            width: entity.dimensions.width,
            height: entity.dimensions.height
        },
        "ghost"
    );

    ghost.setSpriteSheet(spriteSheet);

    ghost.components.direction = entity.components.direction;

    mainLevel.addEntity(ghost);
    mainLevel.mountEntities();

    ghost.elem.style.backgroundPosition =
        entity.elem.style.backgroundPosition;

    ghost.elem.style.backgroundSize =
        entity.elem.style.backgroundSize;

    ghost.elem.style.opacity = "0.7";
    ghost.elem.style.filter =
        "brightness(2) hue-rotate(180deg)";

    ghost.elem.style.transition =
        "opacity 0.15s linear";

    setTimeout(() => {
        ghost.elem.style.opacity = "0";
    }, 10);

    setTimeout(() => {

        ghost.elem.remove();

        const index =
            mainLevel.entities.indexOf(ghost);

        if (index !== -1) {
            mainLevel.entities.splice(index, 1);
        }

    }, 160);
}