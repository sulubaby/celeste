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

    const dashData = player.components.powers.dash;

    if (
        input.includes(keys.dash) &&
        !dashData.isDashing &&
        !dashData.onCooldown
    ) {
        dash(player);
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

function dash(player) {
    const dash = player.components.powers.dash;
    const maxDistance = 250;

    dash.distanceTravelled = 0;
    dash.isDashing = true;

    const airDash = player.components.physics.gravity.isJumping;

    const movingLeft = input.includes(keys.left);
    const movingRight = input.includes(keys.right);

    const verticalDash =
        airDash &&
        !movingLeft &&
        !movingRight;

    let loop;

    function perform() {
        if (verticalDash) {
            player.position.y -= dash.dashPower;
        } else if (airDash) {

            if (movingLeft) {
                player.position.x -= dash.dashPower / 2;
                console.log('dash left')
            }

            if (movingRight) {
                player.position.x += dash.dashPower / 2;
                console.log('dash right')

            }

            player.position.y -= dash.dashPower / 2;
        } else {
            player.position.x +=
                dash.dashPower *
                player.components.direction;
        }

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

    loop = setInterval(perform, 10);
}