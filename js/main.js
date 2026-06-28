import { createBird } from "./entities/bird.js";
import { Entity } from "./entities/entity.js";
import { createPlayer } from "./entities/player.js";
import { createSnow } from "./helpers/snow.js";
import { Level } from "./level.js";
import { createTutorial } from "./levels/tutorial.js";
import { Camera } from "./systems/camera.js";
import { initInputs } from "./systems/input.js";
import { collision, gravity } from "./systems/physics.js";
import { gameState, pauseGame, resumeGame } from "./helpers/gameState.js";
import { hideDialogue, showDialogue } from "./helpers/sign.js";
import { firstLevel } from "./levels/firstLevel.js";
import { showMainMenu } from "./helpers/mainMenu.js";

console.log('loaded');

export let strawCount = 0;
export const GAME_TIME_LIMIT_SECONDS = 300;
export let gameTimeRemaining = GAME_TIME_LIMIT_SECONDS;

export const levels = [createTutorial, firstLevel];
export let level = 0;

export function setLevel(n) {
  level = n;
}
export const gameContainer = document.getElementById("game");
export let mainLevel;

const gameHud = document.getElementById("game-hud");
const hudStrawberryCount = document.getElementById("hud-strawberry-count");
const hudTimer = document.getElementById("hud-timer");
const loseScreen = document.getElementById("lose-screen");
const loseMainMenuBtn = document.getElementById("lose-main-menu-btn");

export const collectedStrawberryIds = new Set();

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function updateHud(dt = 0) {
  if (!gameState.isGameOver && dt > 0) {
    gameTimeRemaining = Math.max(0, gameTimeRemaining - dt);

    if (gameTimeRemaining <= 0) {
      showLoseScreen();
    }
  }

  hudStrawberryCount.textContent = `${strawCount}`;
  hudTimer.textContent = formatTime(gameTimeRemaining);
}

export function resetGameProgress() {
  strawCount = 0;
  gameTimeRemaining = GAME_TIME_LIMIT_SECONDS;
  collectedStrawberryIds.clear();
  gameState.isGameOver = false;
  gameState.isWin = false;
  loseScreen.classList.add("hidden");
  updateHud();
}

export function showHud() {
  gameHud.classList.remove("hidden");
  updateHud();
}

export function collectStrawberry(strawberryId = "") {
  if (strawberryId) {
    collectedStrawberryIds.add(strawberryId);
  }

  strawCount++;
  updateHud();
}

export function isStrawberryCollected(strawberryId = "") {
  return collectedStrawberryIds.has(strawberryId);
}

export function showLoseScreen() {
  if (gameState.isGameOver) return;
  
  gameState.isGameOver = true;
  loseScreen.classList.remove("hidden");
}

loseMainMenuBtn.addEventListener("click", () => {
  location.reload();
});

export const player = createPlayer(
  {
    x: 3400,
    y: -2700
  },
  {
    width: 64,
    height: 64
  },
  "./assets/player3.png"
);

export const camera = new Camera(player);

export let animationFrameId = null;

document.addEventListener("keydown", (e) => {
  if (e.key === "e" && !e.repeat) {
    if (!gameState.isPaused) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});

showMainMenu();
updateHud();

export function main(level) {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  mainLevel = level;
  mainLevel.mountEntities();

  let lastTime = performance.now();

  function gameLoop(currentTime) {
    if (!gameState.isPaused) {
      let dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (dt > 0.1) dt = 0.1;

      updateHud(dt);

      if (!gameState.isGameOver) {
        mainLevel.update(dt);
        camera.update();
      }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  showHud();
  animationFrameId = requestAnimationFrame(gameLoop);
}
