import { createEnvironment } from "./environments/environment.js";
import { initInput, keys } from "./core/system/input.js";
import { createPlayer } from "./core/entities/player.js";
import { Level } from "./core/level.js";
import { animationSystem } from "./core/system/animationSystem.js"
import { gravity, setGroundY } from "./core/system/physicsSystem.js";
import { createPlatform, createPlatforms } from "./core/entities/platforms.js";
import { Camera } from "./core/components/camera.js";
import { Entity } from "./core/entities/entity.js";

const fpsElement = document.getElementById("fps");
const timeElement = document.getElementById("time");
const pauseMenu = document.getElementById("pause-menu");
export const gameContainer = document.getElementById('platform-layer');

let isPaused = false;
let lastTime = performance.now();
let gameTime = 0;

//createEnvironment();
const game = document.getElementById("platform-layer");

export const mainLevel = new Level(
    { height: 800, width: 5000 }
);

setGroundY(mainLevel.dimensions.height);

mainLevel.setParent(game);
mainLevel.addSystem(gravity);

export const player = createPlayer(
    { x: 0, y: 0 },
    { height: 128, width: 128 },
    "./assets/player.png"
);

player.components.animation.state.sprite = "idle";
mainLevel.addEntity(player);
mainLevel.addSystem(animationSystem);
player.components.powers.jump.isJumping = false;
console.log(player);


// camera
export const camera = new Camera(player);

// create platform
for (let i = 0; i < 50; i++) {
    const x = -300 + i * 50;

    const platform = createPlatform(
        { height: 50, width: 50 },
        { x: x, y: 564 }
    );

    platform.setSpriteSheet("./assets/IceTiles/Ice_3_16x16.png");
    mainLevel.addEntity(platform);
}

initInput('ArrowLeft', 'ArrowRight', 'ArrowUp', 'w');
console.log(keys);

mainLevel.mountEntities();

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
    camera.update();
    if (!isPaused) {
        update(deltaTime);
        renderFPS(deltaTime);
    }

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);