import { createEnvironment } from "./environments/environment.js";
import { initInput, keys } from "./core/system/input.js";
import { createPlayer } from "./core/entities/player.js";
import { Level } from "./core/level.js";
import { animationSystem } from "./core/system/animationSystem.js"
import { gravity, setGroundY } from "./core/system/physicsSystem.js";
import { createPlatforms } from "./environments/platforms.js";

const fpsElement = document.getElementById("fps");
const timeElement = document.getElementById("time");
const pauseMenu = document.getElementById("pause-menu");
export const gameContainer = document.getElementById('game');

let isPaused = false;
let lastTime = performance.now();
let gameTime = 0;

//createEnvironment();
const game = document.getElementById("game");
createPlatforms(game);

export const mainLevel = new Level(
    { height: 800, width: 5000 }
);

setGroundY(mainLevel.dimensions.height);

mainLevel.setParent(game);
mainLevel.addSystem(gravity);

export const player = createPlayer(
    { x: 100, y: 100 },
    { height: 128, width: 128 },
    "./assets/player.png"
);

player.components.animation.state.sprite = "idle";
mainLevel.addEntity(player);
mainLevel.mountEntities();
mainLevel.addSystem(animationSystem);
player.components.powers.jump.isJumping = false;
console.log(player);

initInput('a', 'd', 'w', 'q');
console.log(keys);
function update(deltaTime) {
    const dt = deltaTime / 1000;
    gameTime += dt;
    mainLevel.update(dt);
    timeElement.textContent = Math.floor(gameTime);
}

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