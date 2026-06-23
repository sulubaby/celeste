import { inputs, keys } from "../systems/input.js";

const pauseMenu = document.getElementById("pause-menu");
const continueBtn = document.getElementById("continue-btn");
const restartBtn = document.getElementsByClassName("restart-btn");

export const gameState = {
  score: 0,
  lives: 3,

  startTime: Date.now(),

  isGameOver: false,
  isWin: false,
  isPaused: false,

  pauseStartTime: 0,
  totalPauseTime: 0,
};

export function pauseGame() {
  gameState.isPaused = true;
  gameState.pauseStartTime = Date.now();
  pauseMenu.classList.remove("hidden");
}

export function resumeGame() {
  gameState.isPaused = false;
  gameState.totalPauseTime += Date.now() - gameState.pauseStartTime;
  pauseMenu.classList.add("hidden");
}

function restartGame() {
  location.reload();
}

for (let i = 0; i < restartBtn.length; i++) {
  restartBtn[i].addEventListener("click", restartGame);
}

continueBtn.addEventListener("click", (e) => {
  resumeGame();
  console.log(gameState.isPaused);
});
