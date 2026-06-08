import { addDashing, addJump, addSpeed } from "../components/movement.js";
import { Entity } from "./entity.js";
import { addAnimation, playAnimation } from "../components/animation.js";
import { gravity, onGround } from "../system/physicsSystem.js";
import { applyGravity } from "../components/physics.js";
import { input, keys } from "../system/input.js";
import { camera } from "../../main.js";

export function createPlayer(
    position = { x: 400, y: 400 },
    dimensions = { height: 128, width: 128 },
    spriteSheetSrc = ""
) {
    const player = new Entity(
        position,
        dimensions,
        "player"
    );

    player.setSpriteSheet(spriteSheetSrc);

    addSpeed(player, 500);
    addDashing(player, 30);
    applyGravity(player, { vy: 0, isGround: false, isJumping: false });
    addJump(player, 700);

    addAnimation(player, "idle", {
        row: 5,
        startFrame: 6,
        frameCount: 4,
        fps: 10
    });

    addAnimation(player, "run", {
        row: 0,
        startFrame: 0,
        frameCount: 8,
        fps: 12
    });

    addAnimation(player, "fall", {
        row: 9,
        startFrame: 3,
        frameCount: 8,
        fps: 12
    });

    addAnimation(player, "jump", {
        row: 9,
        startFrame: 0,
        frameCount: 1,
        fps: 12
    });

    player.setUpdate(playerUpdate);
    player.components.direction = 1;
    player.setScale(0.6);
    return player;
}

function playerUpdate(entity, dt) {
    let moving = false;
    if (input.includes(keys.left)) {
        entity.position.x -= entity.components.powers.speed.speed * dt;
        entity.components.direction = -1;
        moving = true;
    }

    if (input.includes(keys.right)) {
        entity.position.x += entity.components.powers.speed.speed * dt;
        entity.components.direction = 1;
        moving = true;
    }

    if (
        input.includes(keys.jump) && !entity.components.powers.jump.isJumping) {
        entity.components.physics.gravity.vy = -entity.components.powers.jump.jumpPower;

        entity.components.powers.jump.isJumping = true;
    }

    const dashData = entity.components.powers.dash;

    if (
        input.includes(keys.dash) &&
        !dashData.isDashing &&
        !dashData.onCooldown
    ) {
        dash(entity);
    }

    if (!onGround(entity)) {
        if (entity.components.physics.gravity.vy < 0) {
            playAnimation(entity, "jump");
        } else {
            playAnimation(entity, "fall");
        }
    } else if (moving) {
        playAnimation(entity, "run")
    } else {
        playAnimation(entity, "idle")
    }


    const animation = entity.components.animation;

    if (!animation) return;

    const sprite =
        animation.sprites[animation.state.sprite];

    if (!sprite) return;

    const frame =
        sprite.startFrame + animation.state.frame;

    const frameWidth = entity.dimensions.width;
    const frameHeight = entity.dimensions.height;

    entity.elem.style.backgroundPosition =
        `-${frame * frameWidth}px -${sprite.row * frameHeight}px`;
}

function dash(player) {
    const dash = player.components.powers.dash;
    const maxDistance = 250;

    dash.distanceTravelled = 0;
    dash.isDashing = true;

    const airDash = player.components.powers.jump.isJumping;

    const movingLeft = input.includes(keys.left);
    const movingRight = input.includes(keys.right);
    const movingUp = input.includes(keys.jump);

    let loop;

    function perform() {
        if (airDash) {
            if (movingLeft && movingUp) {
                player.position.x -= dash.dashPower;
                player.position.y -= dash.dashPower;
            } else if (movingRight && movingUp) {
                // Up-right
                player.position.x += dash.dashPower;
                player.position.y -= dash.dashPower;
            } else if (movingUp) {
                // Straight up
                player.position.y -= dash.dashPower;
            } else if (movingLeft) {
                // Straight left (in air)
                player.position.x -= dash.dashPower;
            } else if (movingRight) {
                // Straight right (in air)
                player.position.x += dash.dashPower;
            } else {
                // Dash in facing direction
                player.position.x += dash.dashPower * player.components.direction;
            }
        } else {
            if (movingLeft) {
                player.position.x -= dash.dashPower;
            } else if (movingRight) {
                player.position.x += dash.dashPower;
            } else {
                player.position.x += dash.dashPower * player.components.direction;
            }
        }

        dash.distanceTravelled += dash.dashPower;

        if (dash.distanceTravelled >= maxDistance) {
            clearInterval(loop);
            dash.isDashing = false;
            dash.onCooldown = true;
            setTimeout(() => { dash.onCooldown = false; }, 1000);
        }
    }

    loop = setInterval(perform, 20);
}