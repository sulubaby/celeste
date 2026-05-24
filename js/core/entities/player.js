import { animationData, animationState, positions } from "../../data/data.js";
import { entities } from "../../data/entities.js";
import {input} from "../system/input.js"
export function createPlayer(
    playerHeight = 32,
    playerWidth = 32,
    playerSpeed = 100,
    spawnY = 0,
    spawnX = 0,
    spriteSheet = ""
) {
    const element = document.createElement("div");

    element.style.backgroundImage = `url(${spriteSheet})`;
    element.style.transform = `translate(${spawnX}px, ${spawnY}px)`;
    element.style.height = `${playerHeight}px`;
    element.style.width = `${playerWidth}px`;
    element.style.position = "absolute";
    element.style.backgroundRepeat = "no-repeat";
    element.style.imageRendering = "pixelated";
    element.style.overflow = "hidden";
    element.style.backgroundSize = "auto";
    element.style.willChange = "transform";
    element.id = "player";

    positions["player"] = {
        x: spawnX,
        y: spawnY
    }
    return element;
}

export function updatePlayer() {

    let direction = 1;

    if (input.left) {

        animationState["player"].spriteName = "run";
        direction = -1;

    } else if (input.right) {

        animationState["player"].spriteName = "run";

    } else {
        animationState["player"].spriteName = "idle";
    }

    const player = entities["player"];

    const width = parseInt(player.style.width);
    const height = parseInt(player.style.height);

    const state = animationState["player"];
    const anim = animationData["player"][state.spriteName];

    const spriteX = width * (anim.startFrame + state.frame);
    const spriteY = height * anim.row;

    player.style.backgroundPosition =
        `-${spriteX}px -${spriteY}px`;


    // Render player
    player.style.transform =
        `translate(${positions["player"].x}px, ${positions["player"].y}px) scaleX(${direction})`;
}