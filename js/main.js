import { createEnvironment } from "./environments/environment.js";
import { addAnimation } from "./core/components/animation.js";
import { createPlayer, updatePlayer } from "./core/entities/player.js";
import { animationData, animationState, positions } from "./data/data.js";
import { entities } from "./data/entities.js";
import { animationSystem } from "./core/system/animationSystem.js";
import { initInput } from "./core/system/input.js";
import { movementSystem } from "./core/system/movementSystem.js";

const fpsElement = document.getElementById("fps");
const timeElement = document.getElementById("time");
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-btn");
const restartButton = document.getElementById("restart-btn");
const container = document.getElementById('platform-layer');

let isPaused = false;
let lastTime = performance.now();
let gameTime = 0;

createEnvironment();

// create player
const player = createPlayer(128, 128, 5, 1000, 100, "./assets/player.png");
entities[player.id] = player;
container.appendChild(player);

// add animation, idle
addAnimation("player", "idle", {
  row: 5,
  startFrame: 6,
  frameCount: 4,
  fps: 10
});

addAnimation("player", "run", {
  row: 0,
  startFrame: 1,
  frameCount: 8,
  fps: 20
});

//falling animation
addAnimation("player", "fall", {
  row: 9,
  startFrame: 4,
  frameCount: 1,
  fps: 20
});

// jump animation
addAnimation("player", "jump", {
  row: 7,
  startFrame: 14,
  frameCount: 0,
  fps: 20
});

console.log(animationState)
initInput();


function update(deltaTime) {
  const dt = deltaTime / 1000;
  gameTime += dt;
  movementSystem(dt);

  updatePlayer(dt);

  timeElement.textContent = Math.floor(gameTime);
}

function renderFPS(deltaTime) {
  const dt = deltaTime / 1000;

  const fps = Math.round(1000 / deltaTime);

  fpsElement.textContent = fps;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    togglePause();
  }
});

continueButton.addEventListener("click", () => {
  togglePause();
});

restartButton.addEventListener("click", () => {
  location.reload();
});

function togglePause() {
  isPaused = !isPaused;
  pauseMenu.classList.toggle("hidden", !isPaused);
}

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  animationSystem(deltaTime);

  if (!isPaused) {
    update(deltaTime);
    renderFPS(deltaTime);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

