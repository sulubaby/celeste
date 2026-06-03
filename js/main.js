import { createEnvironment } from "./environments/environment.js";
import { addAnimation } from "./core/components/animation.js";
import { Player } from "./core/entities/player.js";
import { initInput } from "./core/system/input.js";
import { playerMovment } from "./core/system/playerMovment.js";
import { animationSystem } from "./core/system/animationSystem.js";
import { applyGravity } from "./core/components/physics.js";
import { gravity } from "./core/system/physicsSystem.js";
import { addDashing } from "./core/components/movement.js";

const fpsElement = document.getElementById("fps");
const timeElement = document.getElementById("time");
const pauseMenu = document.getElementById("pause-menu");
export const gameContainer = document.getElementById('game');

let isPaused = false;
let lastTime = performance.now();
let gameTime = 0;

createEnvironment();

export const player = new Player(
    { x: 100, y: 100 },
    { height: 128, width: 128 },
    { speed: 500 }
);

player.setSpriteSheet("./assets/player.png");
player.appendPlayer(gameContainer);

addAnimation(player, "idle", {
    row: 5,
    startFrame: 6,
    frameCount: 4,
    fps: 10
});

addAnimation(player, "run", {
    row: 0,
    startFrame: 0,
    frameCount: 8,
    fps: 12
});

addAnimation(player, "fall", {
    row: 9,
    startFrame: 3,
    frameCount: 8,
    fps: 12
})

applyGravity(player, {vy: 0, isJumping: false})
addDashing(player, 50);

player.components.animation.state.sprite = "idle";

initInput();

function update(deltaTime) {
    const dt = deltaTime / 1000;

    playerMovment(player, dt);
    animationSystem(dt, player);
    gravity(dt, player)
    player.update();

    gameTime += dt;
    timeElement.textContent = Math.floor(gameTime);
}
console.log(player)
function renderFPS(deltaTime) {
    fpsElement.textContent = Math.round(1000 / deltaTime);
}

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (!isPaused) {
        update(deltaTime);
        renderFPS(deltaTime);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);