import { addDashing, addJump, addSpeed } from "../components/movement.js";
import { Entity } from "./entity.js";
import { addAnimation, playAnimation } from "../components/animation.js";
import { gravity, onGround } from "../system/physicsSystem.js";
import { applyGravity } from "../components/physics.js";
import { input, keys } from "../system/input.js";
import { camera } from "../../main.js";
import { mainLevel } from "../../main.js";
import { playSound } from "../helpers/sound.js";

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
        fps: 8
    });

    addAnimation(player, "run", {
        row: 0,
        startFrame: 0,
        frameCount: 8,
        fps: 12
    });

    addAnimation(player, "fall", {
        row: 9,
        startFrame: 1,
        frameCount: 10,
        fps: 12
    });

    addAnimation(player, "jump", {
        row: 9,
        startFrame: 0,
        frameCount: 1,
        fps: 12
    });
    addAnimation(player, "squeez", {
        row: 1,
        startFrame: 0,
        frameCount: 3,
        fps: 20
    });
    addAnimation(player, "fallAfter", {
        row: 11,
        startFrame: 4,
        frameCount: 6,
        fps: 20
    });

    player.setUpdate(playerUpdate);
    player.components.direction = 1;
    player.components.wasOnGround = false;
    player.setScale(0.6);
    player.elem.style.willChange = "transform";

    return player;
}

function playerUpdate(entity, dt) {

    let moving = false;

    const grounded = onGround(entity);

    if (input.includes(keys.left)) {
        entity.position.x -=
            entity.components.powers.speed.speed * dt;

        entity.components.direction = -1;
        moving = true;
    }

    if (input.includes(keys.right)) {
        entity.position.x +=
            entity.components.powers.speed.speed * dt;

        entity.components.direction = 1;
        moving = true;
    }

    if (
        input.includes(keys.jump) &&
        !entity.components.powers.jump.isJumping
    ) {
        entity.components.physics.gravity.vy =
            -entity.components.powers.jump.jumpPower;

        entity.components.powers.jump.isJumping = true;

        playSound(
            "assets/soundTrack/player/jump_dreamblock.wav"
        );
    }

    const dashData = entity.components.powers.dash;

    if (
        input.includes(keys.dash) &&
        !dashData.isDashing &&
        !dashData.onCooldown
    ) {
        dash(entity);

        playSound(
            "assets/soundTrack/player/dash_pink_left.wav"
        );
    }

    if (!grounded) {

        if (
            entity.components.physics.gravity.vy < 0
        ) {

            playAnimation(entity, "jump");

        } else {

            entity.components.physics.gravity.airTime += dt;

            if (
                entity.components.physics.gravity.airTime < 0.1
            ) {

                playAnimation(entity, "fallAfter");

            } else {

                playAnimation(entity, "fall");

            }
        }

    } else {

        entity.components.physics.gravity.airTime = 0;

        if (!entity.components.wasOnGround) {

            playAnimation(entity, "squeez");

        } else if (moving) {

            playAnimation(entity, "run");

        } else {

            playAnimation(entity, "idle");

        }
    }

    entity.components.wasOnGround = grounded;

    const animation = entity.components.animation;

    if (!animation) return;

    const sprite =
        animation.sprites[
        animation.state.sprite
        ];

    if (!sprite) return;

    const frame =
        sprite.startFrame +
        animation.state.frame;

    const frameWidth =
        entity.dimensions.width;

    const frameHeight =
        entity.dimensions.height;

    entity.elem.style.backgroundPosition =
        `-${frame * frameWidth}px -${sprite.row * frameHeight}px`;
}

function dash(player) {

    const dash = player.components.powers.dash;
    const maxDistance = 250;

    dash.distanceTravelled = 0;
    dash.isDashing = true;

    let dx = 0;
    let dy = 0;

    if (input.includes(keys.left)) dx = -1;
    if (input.includes(keys.right)) dx = 1;
    if (input.includes(keys.jump)) dy = -1;

    if (dx === 0 && dy === 0) {
        dx = player.components.direction;
    }

    const length = Math.hypot(dx, dy);

    if (length > 0) {
        dx /= length;
        dy /= length;
    }

    let loop;

    function perform() {

        createGhost(player, "./assets/player.png");

        player.position.x += dx * dash.dashPower;
        player.position.y += dy * dash.dashPower;

        dash.distanceTravelled += dash.dashPower;

        if (dash.distanceTravelled >= maxDistance) {
            clearInterval(loop);

            dash.isDashing = false;
            dash.onCooldown = true;

            setTimeout(() => {
                dash.onCooldown = false;
            }, 1000);
        }
    }

    loop = setInterval(perform, 18);
}

function createGhost(entity, spriteSheet) {

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
    ghost.setScale(0.6);
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
