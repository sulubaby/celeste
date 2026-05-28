import { animationData, animationState, positions } from "../../data/data.js";
import { entities, } from "../../data/entities.js";
import { applyGravity } from "../components/gravity.js";
import { input } from "../system/input.js"
import { onGround } from "../system/physics.js";

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
    element.style.scale = 0.7;
    element.id = "player";



    positions["player"] = {
        x: spawnX,
        y: spawnY,
        vy: 0,
        isJumping: false,
    }
    return element;
}

export function updatePlayer() {
    const player = entities["player"];
    const state = animationState["player"];
    const pos = positions["player"];
    let nextAnimation = "idle";

    if (!onGround()) {
        if(positions.player.vy < 0) {
            nextAnimation = "jump";
        } else {
            nextAnimation = "fall";
        }
    } else if (input.left || input.right) {
        nextAnimation = "run";
    }


    // Reset frame when animation changes
    if (state.spriteName !== nextAnimation) {
        state.spriteName = nextAnimation;
        state.frame = 0;
        state.timer = 0;
    }

    // Store direction instead of resetting it every frame
    if (input.left) {
        state.direction = -1;
    } else if (input.right) {
        state.direction = 1;
    }

    const width = parseInt(player.style.width);
    const height = parseInt(player.style.height);

    const anim = animationData["player"][state.spriteName];

    // Prevent frame from going outside the animation frame count
    if (state.frame >= anim.frameCount) {
        state.frame = 0;
    }

    const spriteX = width * (anim.startFrame + state.frame);
    const spriteY = height * anim.row;

    player.style.backgroundPosition = `-${spriteX}px -${spriteY}px`;

    player.style.transform =
        `translate(${positions["player"].x}px, ${positions["player"].y}px) scaleX(${state.direction})`;
}