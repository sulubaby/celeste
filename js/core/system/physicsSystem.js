import { platforms } from "../../core/entities/platforms.js";
import { playAnimation } from "../components/animation.js";
import { playSound } from "../helpers/sound.js";

export let GRAVITY = 1700;
export let GROUND = 1200;
export let MAX_FALL_SPEED = 1200;


export function setGroundY(value) {
  GROUND = value;
}

export function gravity(entities, dt) {
    entities.forEach((entity) => {

        if (
            !entity.components ||
            !entity.components.physics ||
            !entity.components.physics.gravity
        ) {
            return;
        }

        const physics = entity.components.physics.gravity;

        physics.vy += GRAVITY * dt;

        if (physics.vy > MAX_FALL_SPEED) {
            physics.vy = MAX_FALL_SPEED;
        }

        entity.position.y += physics.vy * dt;

        const grounded = onGround(entity);

        // Just landed
        if (
            grounded &&
            !entity.components.wasOnGround &&
            entity.id === "player"
        ) {
            playSound(
                "./assets/soundTrack/player/land_00_asphalt_04.wav"
            );
        }

        if (grounded) {
            entity.position.y =
                GROUND - entity.dimensions.height;

            entity.components.powers.jump.isJumping = false;
            physics.vy = 0;
        }

        entity.components.wasOnGround = grounded;
    });
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
  return entity.position.y + entity.dimensions.height >= GROUND - 1;
}
