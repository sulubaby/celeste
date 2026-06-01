import { input, keys } from "./input.js";

export function playerMovment(player, dt) {
    if (input.includes(keys.left)) {
        player.position.x -= player.components.speed * dt;
    }

    if (input.includes(keys.right)) {
        player.position.x += player.components.speed * dt;
    }
}