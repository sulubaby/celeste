import { input, keys } from "./input.js";

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

    if (moving) {
        playAnimation(player, "run");
    } else {
        playAnimation(player, "idle");
        player.components.direction = 1;
    }
}