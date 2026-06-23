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

export const gameContainer = document.getElementById("game");

export const player = createPlayer(
  {
    x: 0,
    y: 100,
  },
  {
    height: 64,
    width: 64,
  },
  "./assets/player3.png",
);

document.addEventListener("keydown", (e) => {
  if (e.key === "e" && !e.repeat) {
    if (!gameState.isPaused) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});

export const bird = createBird();

export let mainLevel;

mainLevel = await createTutorial();
mainLevel.mountEntities();

console.log(bird);

export const camera = new Camera(player);

initInputs();

const snow = createSnow(gameContainer);

let lastTime = performance.now();

function gameLoop(currentTime) {
  if (!gameState.isPaused) {
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (dt > 0.1) dt = 0.1;
    mainLevel.update(dt);
    camera.update();
    snow.update(dt);
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
