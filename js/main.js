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

export const levels = [createTutorial, firstLevel];
export let level = 0;

export function setLevel(n) {
  level = n;
}
export const gameContainer = document.getElementById("game");
export let mainLevel;


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

      mainLevel.update(dt);
      camera.update();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}