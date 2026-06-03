import { detectInput, input, keys } from "./input.js";
import { onGround } from "./physicsSystem.js";

const JUMP_POWER = 700;

function playAnimation(entity, sprite) {
    const animation = entity.components.animation;

    if (animation.state.sprite === sprite) return;

    animation.state.sprite = sprite;
    animation.state.frame = 0;
    animation.state.timer = 0;
}

export function playerMovment(player, dt) {

    let moving = false;
    if (input.includes(keys.left)) {
        player.position.x -= player.components.speed * dt;
        player.components.direction = -1;
        moving = true;
    }

    if (input.includes(keys.right)) {
        player.position.x += player.components.speed * dt;
        player.components.direction = 1;
        moving = true;
    }

    if (input.includes(keys.jump) && onGround(player)) {
        player.components.physics.gravity.vy = -JUMP_POWER;
        player.components.physics.gravity.isJumping = true;
    }

    if (input.includes(keys.dash) && !player.components.powers.dash.isDashing) {
        player.components.powers.dash.isDashing = true;
        let dashDirection = 0;
        if(input.includes(keys.right)) {
            dashDirection = 1;
        } else if(input.includes(keys.left)) {
            dashDirection = -1
        }
        dash(player, dt);
    }


    if (!onGround(player)) {
        if (player.components.physics.gravity.vy < 0) {
            playAnimation(player, "jump");
        } else {
            playAnimation(player, "fall");
        }
    } else if (moving) {
        playAnimation(player, "run");
    } else {
        playAnimation(player, "idle");
    }

}

function dash(player, dt) {
    const maxDistance = 140;

    player.components.powers.dash.distanceTravelled = 0;
    player.components.powers.dash.isDashing = true;

    let loop;

    function perform() {

        player.position.x +=
            player.components.powers.dash.dashPower *
            player.components.direction;

        player.components.powers.dash.distanceTravelled +=
            player.components.powers.dash.dashPower;

        if (player.components.powers.dash.distanceTravelled >= maxDistance) {
            clearInterval(loop);
            player.components.powers.dash.isDashing = false;
        }
    }

    loop = setInterval(perform, 10);
}
