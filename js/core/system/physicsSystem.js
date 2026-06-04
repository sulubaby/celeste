import { platforms } from "../../environments/platforms.js";

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

  //updatePhysics(entity);
}

export function updatePhysics(entity) {
  // Platform collision (includes ground)
  platforms.forEach((platform) => {
    const playerBottom = entity.position.y + entity.dimensions.height;
    const playerRight = entity.position.x + entity.dimensions.width;
    const playerLeft = entity.position.x;

    const wasAbovePlatform = playerBottom - entity.components.physics.gravity.vy <= platform.y;
    // Checks if the player was above the platform in the previous frame

    const nowBelowPlatform = playerBottom >= platform.y;
    // Checks if the player's bottom has now reached or passed the platform's top (potential landing)

    const horizontalOverlap =
      playerRight > platform.x && playerLeft < platform.x + platform.width;

    if (
      horizontalOverlap &&
      wasAbovePlatform &&
      nowBelowPlatform &&
      entity.components.physics.gravity.vy >= 0
    ) {
      entity.position.y = platform.y - entity.dimensions.height; // snap entity on top
      entity.components.physics.gravity.vy = 0;
      entity.components.physics.gravity.isJumping = false;
    }
  });
}

export function onGround(entity) {
  return entity.position.y + entity.dimensions.height >= GROUND_Y - 1;
}
