import { createEnvironment } from "./environments/environment.js";
import { addAnimation } from "./core/components/animation.js";
import { Player } from "./core/entities/player.js";
import { initInput, input } from "./core/system/input.js";
import { playerMovment } from "./core/system/playerMovment.js";

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
export const player = new Player(
  {x: 100, y:100},
  {height: 128, width: 128},
  {speed: 500}
);
console.log(player)
player.setSpriteSheet("./assets/player.png");
player.appendPlayer(document.getElementById('mid-layer'));

addAnimation(player, "idle", {
  row: 5,
  startFrame: 6,
  frameCount: 4,
  fps: 10
});

initInput();
function update(deltaTime) {
  const dt = deltaTime / 1000;
  playerMovment(player, dt)
  player.update();
  gameTime += dt;

  timeElement.textContent = Math.floor(gameTime);
}

function renderFPS(deltaTime) {
  const dt = deltaTime / 1000;

  const fps = Math.round(1000 / deltaTime);

  fpsElement.textContent = fps;
}

function togglePause() {
  isPaused = !isPaused;
  pauseMenu.classList.toggle("hidden", !isPaused);
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

