// Import small pieces of code from other files so we can use them here.
// These are modules the game depends on (entities, levels, systems, helpers).
import { createBird } from "./entities/bird.js"; // unused here but available for levels
import { Entity } from "./entities/entity.js"; // base Entity class
import { createPlayer } from "./entities/player.js"; // function to create the player
import { createSnow } from "./helpers/snow.js"; // very small snow effect
import { Level } from "./level.js"; // Level manager class
import { createTutorial } from "./levels/tutorial.js"; // tutorial level factory
import { Camera } from "./systems/camera.js"; // simple camera that snaps to chunks
import { initInputs } from "./systems/input.js"; // sets up keyboard listeners
import { collision, gravity } from "./systems/physics.js"; // physics helpers
import { gameState, pauseGame, resumeGame } from "./helpers/gameState.js"; // pause/resume and state
import { hideDialogue, showDialogue } from "./helpers/sign.js"; // dialogue helpers (UI)
import { firstLevel } from "./levels/firstLevel.js"; // first level factory
import { showMainMenu } from "./helpers/mainMenu.js"; // show/hide main menu

// A tiny log to confirm the module loaded. Safe to remove if you want silence.
console.log('loaded');

// Game progress variables
export let strawCount = 0; // number of strawberries collected
export const GAME_TIME_LIMIT_SECONDS = 300; // default time limit (5 minutes)
export let gameTimeRemaining = GAME_TIME_LIMIT_SECONDS; // countdown value used by HUD

// Level selection and current level index
export const levels = [createTutorial, firstLevel]; // available level factories
export let level = 0; // index of chosen level

// Helper to change which level is chosen
export function setLevel(n) {
  level = n;
}

// The main DOM element where the game world lives
export const gameContainer = document.getElementById("game");
export let mainLevel; // currently running Level object (set when a level starts)

// HUD elements we update during the game
const gameHud = document.getElementById("game-hud");
const hudStrawberryCount = document.getElementById("hud-strawberry-count");
const hudTimer = document.getElementById("hud-timer");
const loseScreen = document.getElementById("lose-screen");
const loseMainMenuBtn = document.getElementById("lose-main-menu-btn");

// Keep track of which strawberries were collected so they don't reappear
export const collectedStrawberryIds = new Set();

// Small helper to convert seconds into a MM:SS string for the HUD
function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds)); // ensure non-negative integer
  const minutes = Math.floor(safeSeconds / 60); // full minutes
  const remainingSeconds = safeSeconds % 60; // leftover seconds

  // Return a string like "3:07" or "0:59"
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update the HUD values. Called each frame (with dt) or once to refresh UI.
export function updateHud(dt = 0) {
  // If the game is still running, consume time from the timer
  if (!gameState.isGameOver && dt > 0) {
    // Subtract the elapsed time (dt is seconds)
    gameTimeRemaining = Math.max(0, gameTimeRemaining - dt);

    // If time ran out, show the lose screen
    if (gameTimeRemaining <= 0) {
      showLoseScreen();
    }
  }

  // Update HUD DOM elements to reflect current values
  hudStrawberryCount.textContent = `${strawCount}`;
  hudTimer.textContent = formatTime(gameTimeRemaining);
}

// Reset progress to initial values (used when restarting a level)
export function resetGameProgress() {
  strawCount = 0;
  gameTimeRemaining = GAME_TIME_LIMIT_SECONDS;
  collectedStrawberryIds.clear();
  gameState.isGameOver = false;
  gameState.isWin = false;
  loseScreen.classList.add("hidden"); // hide lose UI
  updateHud(); // refresh HUD
}

// Make HUD visible (main menu hides it until gameplay starts)
export function showHud() {
  gameHud.classList.remove("hidden");
  updateHud();
}

// Called when the player picks a strawberry collectible
export function collectStrawberry(strawberryId = "") {
  if (strawberryId) {
    // remember which strawberry was collected so it doesn't reappear
    collectedStrawberryIds.add(strawberryId);
  }

  strawCount++; // increase visible count
  updateHud(); // refresh HUD to show new count
}

// Utility to check whether a collectible has already been taken
export function isStrawberryCollected(strawberryId = "") {
  return collectedStrawberryIds.has(strawberryId);
}

// Show the lose screen and mark the game over
export function showLoseScreen() {
  if (gameState.isGameOver) return; // avoid running twice
  
  gameState.isGameOver = true;
  loseScreen.classList.remove("hidden");
}

// When the player clicks the lose screen main menu button, reload the page
loseMainMenuBtn.addEventListener("click", () => {
  location.reload();
});

// Create the player object with a starting position and sprite
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

// Create a Camera instance that follows the `player` by chunk
export const camera = new Camera(player);

// store the rAF id so we can cancel it when needed
export let animationFrameId = null;

// Toggle pause when user presses the 'e' key (not when key is auto-repeated)
document.addEventListener("keydown", (e) => {
  if (e.key === "e" && !e.repeat) {
    if (!gameState.isPaused) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});

// Start by showing the main menu and updating the HUD once
showMainMenu();
updateHud();

// The main entry point to start the game loop for a `level` object
export function main(level) {
  // If a loop is already running, cancel it first to avoid duplicates
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  mainLevel = level; // remember the level we will update
  mainLevel.mountEntities(); // attach all entity DOM nodes to the page

  let lastTime = performance.now(); // last timestamp for dt calculation

  // This function will be called by the browser for each frame (via rAF)
  function gameLoop(currentTime) {
    // Only update game logic when not paused
    if (!gameState.isPaused) {
      // compute time elapsed since last frame (in seconds)
      let dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Clamp dt to avoid extremely large steps (tab was hidden or frozen)
      if (dt > 0.1) dt = 0.1;

      // Update HUD timer and counters
      updateHud(dt);

      // Only update level simulation if the game isn't over
      if (!gameState.isGameOver) {
        mainLevel.update(dt); // run per-entity updates and systems
        camera.update(); // update camera position
      }
    }

    // Request the next frame and save the id so we can cancel later
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  // Make HUD visible and start the animation loop
  showHud();
  animationFrameId = requestAnimationFrame(gameLoop);
}
