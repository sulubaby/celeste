
export function applyGravity(entity, data = {
    vy: 0,
    isGround: false,
    isJumping: false
}) {

    if(!entity.components) {
        entity.components = {};
    }

    if(!entity.components.physics) {
        entity.components.physics = {};
    }

    entity.components.physics.gravity = data;
}