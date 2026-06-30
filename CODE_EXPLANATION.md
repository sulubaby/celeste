**Project Overview**

This document explains the project code (Celeste clone) and how the requested features are implemented: 60 FPS via requestAnimationFrame, smooth keyboard input, pause/restart, HUD (timer/score/lives), minimal layers, and performance techniques. Each section describes a file, its responsibilities, and the important logic. Links point to files in the workspace.

**How to read this file**
- Each section below names a file and summarizes its key blocks.
- I highlight where the project meets the assignment requirements (60 FPS, rAF, input handling, HUD, pause menu, layers minimization, and performance measurement).

**Files**
- [game.html](game.html)
- [css/game.css](css/game.css)
- [js/main.js](js/main.js)
- [js/level.js](js/level.js)
- [js/components/animation.js](js/components/animation.js)
- [js/components/movement.js](js/components/movement.js)
- [js/components/physics.js](js/components/physics.js)
- [js/entities/entity.js](js/entities/entity.js)
**Project Overview (Friendly, beginner-level explanation)**

You built a small browser game (a Celeste-style level) using only HTML, CSS and JavaScript. This document explains, in simple language, what each file does and why it is written that way. It's written for someone who doesn't know how to code — I'll describe the purpose, what happens step-by-step, and why particular choices were made (for performance and smooth play).

If any section is too brief or you'd like literal line-by-line notes, tell me which file to expand first and I'll produce a full annotated file for that file.

------------------------------------------------------------

`game.html` — the page structure (what you load in the browser)
- Purpose: this is the visible page. It defines areas for the game screen, the HUD (timer, score, lives), menus (main, pause, win, lose) and loads the game code.
- What you'll see in the file:
  - A `div` with id `game` where the game world appears. Everything that moves (player, enemies, tiles) is added inside this `div` by JavaScript.
  - A `div` with id `game-hud` that shows score, timer and lives. The script updates these numbers while you play.
  - A `script type="module" src="./js/main.js"></script>` at the bottom. This line runs the game's JavaScript code and ties everything together.
- Why it's coded like that:
  - Keeping a single `#game` area makes drawing and moving items fast (the code moves things inside it with a method that doesn't force page re-layout).
  - Menus are in the HTML so the look can be controlled by CSS and shown/hidden quickly.

`css/game.css` — how things look and small animation rules
- Purpose: controls visuals and sets rules that affect performance.
- Key ideas explained simply:
  - Use `transform` to move objects: moving an object by changing `transform: translate(x,y)` is fast because the browser can move pixels without recalculating all page layout.
  - Use `image-rendering: pixelated` for pixel-art sprites so images look crisp.
  - Keep HUD and menus with fixed positions so they don't cause layout changes when shown or hidden.
- Why it's coded like that:
  - The CSS choices are made to avoid slow browser work (layout and paint) and keep the game running smoothly.

`js/main.js` — the game's front door and the frame loop (simple version)
- Purpose: creates the player and camera, shows the main menu, and starts the repeating frame loop that drives the game.
- What happens step-by-step (plain terms):
  1. The file sets up the game's scoreboard and timer variables.
  2. It creates the player object and the camera that follows the player.
  3. When you choose a level, the game loads that level and starts a loop called the "game loop".
  4. Each time the browser is ready to draw a new frame (this happens up to 60 times per second), the game loop runs. It figures out how much time passed since the last frame, updates the game's timer and physics using that time, asks the level to update everything (enemies, collisions), updates the camera, and then asks the browser to call it again for the next frame.
- Why it's coded like that (important performance choices):
  - It uses `requestAnimationFrame` (rAF) to ask the browser to call the game loop right before each paint. This gives the smoothest animation and is the recommended pattern for games in the browser.
  - It measures time between frames (`performance.now()`), so movement uses actual time (for example: speed * timePassed). This keeps motion smooth even if the frame rate is not exact.
  - It clamps the time step so if the game was paused or the tab was hidden, the game won't suddenly jump forward when you return.

`js/level.js` — holds everything that belongs to a level
- Purpose: store the list of game objects (called entities), run small systems (like animation and gravity), and draw the objects in the correct place.
- Important parts in plain language:
  - Each object (tile, player, enemy) is an `Entity` with position and size.
  - The `Level` keeps a list of these entities and updates them every frame.
  - `render()` converts each object's game position into a CSS `transform` so the browser moves it quickly on screen.
  - It also does simple culling: if something is off the visible area, it hides it so the browser doesn't waste time painting it.
- Why it's coded like that:
  - Grouping entity updates and systems makes the game easier to maintain and allows selective optimizations (like hiding off-screen objects).

`js/entities/entity.js` — the blueprint for any game object
- Purpose: provides a small structure for any object in the game: position, size, the DOM node that shows the object, and a place to put small behaviors called components.
- Plain explanation:
  - When you make an `Entity`, it creates a `div` element and sizes it to match the entity. Later code places that `div` using `transform`.
  - It gives utility methods to set the sprite image and to give the entity a function to update itself every frame.
- Why it's coded like that:
  - This keeps the representation consistent: every object is a DOM node and can have optional features (components) such as physics or animation.

`js/components/animation.js` and `js/systems/animationSystem.js` — animation data plus a small clock
- Purpose: store animation frames (where in the sprite-sheet each frame lives) and advance those frames over time.
- Beginner explanation:
  - `addAnimation(entity, "run", {row:0, startFrame:0, frameCount:8, fps:12})` tells the entity: "here are the frames and how fast to show them".
  - A separate `animationSystem` runs every frame and increases a timer (based on the frame time). When enough time passed for the next animation frame, it moves forward one frame.
- Why separate data and system:
  - The animation data is small and passive. The system handles the timing centrally, which is more robust and easier to keep fast.

`js/components/movement.js` — attachable movement features
- Purpose: provide small reusable pieces such as walking speed, jump power, and dash power.
- Plain explanation:
  - These functions add data to an entity saying what it is capable of (e.g., "this object can move at 350 pixels/second and climb").
  - The actual behavior (how the player moves based on keys) is written in the player logic; movement components only store the numbers.

`js/components/physics.js` and `js/systems/physics.js` — gravity and collision rules
- Purpose: define how gravity affects a thing and how collisions are detected and resolved.
- Simple explanation:
  - `applyGravity(entity, 1000)` adds a `vy` (vertical speed) that grows each frame using the gravity force multiplied by elapsed time.
  - Collision code looks at two objects' boxes and determines whether they overlap. If they do, it nudges them apart so they don't sit on top of each other.
- Why it's coded like that:
  - Using simple box math is fast and predictable. The code only checks collisions for objects near each other (quick early exit), which saves CPU.

`js/systems/input.js` — how keyboard input is handled (why this gives smooth control)
- Purpose: remember the keys currently pressed and provide that list to the rest of the code.
- Beginner explanation:
  - When you press a key, the code adds that key to an `inputs` list. When you release the key, it removes it.
  - Each frame the game checks: "is the left key in the inputs list?" If yes, keep moving left. That is why you don't have to repeatedly press a key to keep moving — simply holding it works.

`js/entities/player.js` — the player's behavior (how it reads inputs and moves)
- Purpose: ties movement, jump, dash and animations into one behavior for the player object.
- What it does (plain steps):
  1. Check which keys are held (`inputs`) and change the player's `position.x` or `position.y` accordingly. Movement is always multiplied by `dt` (time since last frame) so that speed is consistent regardless of small frame timing variations.
  2. For jumping it sets the vertical speed (`vy`) to a negative value so the player moves up, and gravity will later pull them back down.
  3. For dashing it picks a direction and moves the player quickly for a very short distance.
  4. Picks which animation to show based on movement or vertical speed (running, jumping, falling).
- Why it is coded that way:
  - Time-based movement (`speed * dt`) avoids animation jumps when the frame timing changes.
  - The `inputs` array provides continuous control (hold to move), which is easier for players and feels smooth.

`js/entities/bird.js` and `js/entities/ghost.js` — simple NPCs and visual effects
- Purpose: `bird` is a simple visual enemy/character. `ghost` is an ephemeral (temporary) visual effect used to show a fading copy.
- Why they exist:
  - They provide flavor and examples of how to make other entities: give them sprites, an update function to draw frames, and optionally classes to avoid collisions.

`js/helpers/gameState.js` and `js/helpers/mainMenu.js` — pause, resume, and menu actions
- Purpose: keep track of whether the game is paused, over, and manage menus like restart and main menu.
- Plain behavior:
  - `pauseGame()` sets `isPaused=true` and shows the pause menu element on the page. `resumeGame()` hides it.
  - When paused, the main update function does not change game objects (so the world appears frozen). The `requestAnimationFrame` loop continues but the update code is skipped.
- Why this is coded that way:
  - Pausing by skipping updates is simplest and safe: the browser still runs frames but your game logic does nothing until resumed. This prevents large jumps in game time.

`js/helpers/scene.js`, `js/helpers/sign.js`, `js/helpers/sound.js` — small helpers for scenes, on-screen signs, and sounds
- Purpose: small utility functions that make the levels easier to write (display text dialogues, make small floating signs, play sounds).
- Simple notes:
  - `showDialogue` displays a box for a fixed time and plays a sound.
  - `playSound` creates an `Audio` object and plays it right away.
  - `showSign` creates an image that briefly appears on screen.

`js/helpers/snow.js` — a single lightweight particle layer
- Purpose: draws a small amount of snow by creating a tiny DOM element and moving it with `transform`.
- Why minimal:
  - DOM nodes are heavier than drawing to canvas. The author intentionally uses very few snow flakes so the page doesn't slow down.

`js/systems/camera.js` — how the view follows the player
- Purpose: produces `camera.position` which the renderer uses to decide what part of the level to show.
- Simple idea:
  - The camera snaps by whole chunks (1200 × 500). The camera changes chunk when the player leaves the current chunk. This allows simple level layout and cheap calculations.

`js/levels/firstLevel.js` and `js/levels/tutorial.js` — level specific content and scripted events
- Purpose: load level data (from JSON), create tiles and entities, and run level-specific events like falling blocks, sound triggers and the end sequence.
- How they run:
  - Each level makes a `Level` object, adds common systems (gravity, animation), creates entities from JSON tile data, and defines a `conditions(dt)` function that runs level-specific logic every frame.
  - Example: when the player reaches a certain spot, the level starts an "end scene" and shows the win screen.

------------------------------------------------------------

If you'd like a literal line-by-line file (every single line explained simply) I can do that for one file at a time — which file should I expand first? Suggest `js/main.js` or `js/entities/player.js` if you plan to explain gameplay during the audit.

Summary of what I changed:
- I expanded this file into a beginner-friendly, per-file explanation with plain-language descriptions and reasons for important coding choices.

Next step: tell me which file you want fully line-by-line explained, and I'll generate a separate annotated file that walks through each line.