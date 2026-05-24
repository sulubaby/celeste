import { input } from "./input.js";
import { positions } from "../../data/data.js";

export function movementSystem(dt) {

    const speed = 300;

    if (input.right) {
        positions.player.x += speed * (dt);
    }

    if (input.left) {
        positions.player.x -= speed * (dt);
    }
}