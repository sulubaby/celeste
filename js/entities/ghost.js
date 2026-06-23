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

    mainLevel.addEntity(ghost);
    mainLevel.mountEntities();

    // Copy only the current animation frame
    ghost.elem.style.backgroundPosition = entity.elem.style.backgroundPosition;
    ghost.elem.style.backgroundSize = entity.elem.style.backgroundSize;

    // Visual effects
    ghost.elem.style.pointerEvents = "none";
    ghost.elem.style.opacity = "0.7";
    ghost.elem.style.filter = "brightness(2) hue-rotate(180deg)";
    ghost.elem.style.transition = "opacity 160ms linear";

    // Fade out
    requestAnimationFrame(() => {
        ghost.elem.style.opacity = "0";
    });

    // Remove ghost
    setTimeout(() => {
        const index = mainLevel.entities.indexOf(ghost);

        if (index !== -1) {
            mainLevel.entities.splice(index, 1);
        }

        ghost.elem.remove();
    }, 160);
}