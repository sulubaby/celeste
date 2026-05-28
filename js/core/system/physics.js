import { gravityData, positions } from "../../data/data.js";
import { entities } from "../../data/entities.js";

const GROUND_Y = 1000;
export function gravity(dt) {
    Object.entries(gravityData).forEach(([entityID, data]) => {
        positions[entityID].y += gravityData[entityID].gravityForce * dt;
    });

    positions.entityID.y += gravityData.entityID.vy * dt;

    // ground collision
    if (positions.player.y >= GROUND_Y) {
        positions.player.y = GROUND_Y;
        gravityData.entityID.vy = 0;
        positions.player.isJumping = false;
    }
}


export function onGround() {
    const playerHeight = parseInt(entities.player.style.height);

    return positions.player.y + playerHeight >= GROUND_Y;
}