import { input } from "./input.js";
import { animationState, gravityData, positions } from "../../data/data.js";
import { onGround } from "./physics.js";

export function movementSystem(dt) {

    const speed = 300;
    const gravity = 1000;

    // horizontal movement
    if (input.right) {
        positions.player.x += speed * dt;
    }

    if (input.left) {
        positions.player.x -= speed * dt;
    }

    // jump once
    if (input.jump && onGround()) {
        positions.player.vy -= 20;
    }
    positions["player"].y += positions["player"].vy;

    if (!onGround()) {
        animationState["player"].spriteName = "fall";
        positions.player.vy += 1;
    } else {
        positions.player.vy = 0;
    }


}