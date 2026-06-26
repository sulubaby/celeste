
import { firstLevel } from "../levels/firstLevel.js";
import { createTutorial } from "../levels/tutorial.js";
import { animationFrameId, level, levels, main, mainLevel, setLevel } from "../main.js";
import { resumeGame } from "./gameState.js";
import { wait } from "./scene.js";

const mainMenu = document.getElementById("main-menu");
const chooseLevelBtn = document.getElementById("choose-level-btn");
const levelSelect = document.getElementById("level-select");
const levelBackBtn = document.getElementById("level-back-btn");
const continueBtnMenu = document.getElementById("continue-btn-menu");
const levelCards = document.querySelectorAll(".menu-row[data-level]");

export function showMainMenu() {
  mainMenu.classList.remove("hidden");
}

export function hideMainMenu() {
  mainMenu.classList.add("hidden");
}

chooseLevelBtn.addEventListener("click", () => {
  levelSelect.classList.remove("hidden");
});

levelBackBtn.addEventListener("click", () => {
  levelSelect.classList.add("hidden");
});



document.getElementById('tutorial-btn').addEventListener('click', async () => {
  hideMainMenu();
  setLevel(0);
  const level = await createTutorial();
  main(level)
})

document.getElementById('oldSite').addEventListener('click', async () => {
  hideMainMenu();
  setLevel(1)
  const level = await firstLevel();
  main(level)
})

export function stopGame() {
  cancelAnimationFrame(animationFrameId);
}

document.getElementById("res-btn").addEventListener("click", async () => {
  stopGame();

  await wait(500);
  mainLevel.removeEntities();
  const func = levels[level];
  const newLevel = await func();
  main(newLevel);
  resumeGame();
});

const winScreen = document.getElementById("win-screen");
const winCount = document.getElementById("win-collectable-count");
const winIcon = document.getElementById("win-collectable-icon");
const winMainMenuBtn = document.getElementById("win-main-menu-btn");

export function showWinScreen(collected, total, iconSrc = null) {
  if (iconSrc) {
    winIcon.src = iconSrc;
  }

  winCount.textContent = `${collected} / ${total}`;
  winScreen.classList.remove("hidden");
}

export function hideWinScreen() {
  winScreen.classList.add("hidden");
}

winMainMenuBtn.addEventListener("click", () => {
  hideWinScreen();
});