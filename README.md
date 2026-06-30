# Make Your Game

A Celeste-inspired browser platformer built with vanilla HTML, CSS, and JavaScript.

The game includes a main menu, level selection, animated sprites, collision and gravity systems, a moving camera, strawberries to collect, a countdown timer, lives, win and lose screens, dialogue, and pause/restart flows.

## Features

- Static browser game with no framework or build step
- `requestAnimationFrame` game loop with delta-time movement
- Entity/component style structure for player, physics, movement, and animation
- Tutorial and Old Site levels
- Player movement, jumping, dashing, climbing, death, and respawn logic
- Strawberry collection, HUD counter, lives, and five-minute timer
- Pause menu, restart flow, win screen, lose screen, and end dialogue
- Pixel-art assets, tile sprites, sound effects, and background media

## Controls

The active key bindings are configured when a level starts:

- Move left: `ArrowLeft`
- Move right: `ArrowRight`
- Jump / climb input: `ArrowUp`
- Dash: `W`
- Pause / resume: `E`

## Run Locally

Open `game.html` in a browser.

For the most reliable module loading behavior, serve the folder with a small local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/game.html
```

## Project Structure

```text
.
├── assets/              # Sprites, tiles, sounds, and media
├── css/game.css         # Game layout, menus, HUD, and sprite styling
├── js/components/       # Reusable movement, physics, and animation data
├── js/entities/         # Player and other entity factories
├── js/helpers/          # Menus, game state, sound, scene, signs, snow
├── js/levels/           # Level creation logic
├── js/systems/          # Input, camera, physics, and animation systems
├── js/main.js           # Game state, HUD, player creation, and main loop
├── game.html            # Browser entry point
└── CODE_EXPLANATION.md  # Beginner-friendly code walkthrough
```

## Notes

This project is intentionally written without external dependencies. The code is organized into ES modules so the game systems can stay small and easy to follow.

