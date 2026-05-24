import { createEnvironment } from "./environments/environment.js";

const fpsElement = document.getElementById("fps");
const timeElement = document.getElementById("time");
const pauseMenu = document.getElementById("pause-menu");
const continueButton = document.getElementById("continue-btn");
const restartButton = document.getElementById("restart-btn");

let isPaused = false;
let lastTime = performance.now();
let gameTime = 0;

createEnvironment();

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  if (!isPaused) {
    update(deltaTime);
    renderFPS(deltaTime);
  }

  requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
  gameTime += deltaTime / 1000;
  timeElement.textContent = Math.floor(gameTime);
}

function renderFPS(deltaTime) {
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

requestAnimationFrame(gameLoop);