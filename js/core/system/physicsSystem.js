
export const GRAVITY = 1700;
export const GROUND_Y = document.getElementById('game').getBoundingClientRect().height;
export const MAX_FALL_SPEED = 1200;

export function gravity(dt, entity) {

    const physics = entity.components.physics.gravity;

    physics.vy += GRAVITY * dt;

    if (physics.vy > MAX_FALL_SPEED) {
        physics.vy = MAX_FALL_SPEED;
    }

    entity.position.y += physics.vy * dt;

    if (onGround(entity)) {

        entity.position.y = GROUND_Y - entity.dimensions.height;

        physics.vy = 0;
        physics.isJumping = false;
    }
}

export function onGround(entity) {
    return (
        entity.position.y + entity.dimensions.height >=
        GROUND_Y - 1
    );
}


