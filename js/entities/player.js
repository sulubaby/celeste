import { addAnimation, playAnimation } from "../components/animation.js";
import { addDashing, addJump, addMovement } from "../components/movement.js";
import { addCollisionDetect, addOffSet, applyGravity } from "../components/physics.js";
import { detectInput, inputs, keys, removeKey } from "../systems/input.js";
import { Entity } from "./entity.js";
import { createGhost } from "./ghost.js";
import { playSound } from "../helpers/sound.js"
import { birdSounded, grannyConvo, granyConvoEnd } from "../levels/tutorial.js";
import { camera, mainLevel, player, showLoseScreen } from "../main.js";
import { getBounds, isTouchingLeftWall, isTouchingRightWall } from "../systems/physics.js";
import { hideSign, showSign } from "../helpers/sign.js";
import { wait } from "../helpers/scene.js";
import { showEndDialogue, stopGame } from "../helpers/mainMenu.js";

export function createPlayer(
    spawnPosition = {
        x: 0,
        y: 0
    },
    dimensions = {
        height: 0,
        width: 0
    },
    spriteSheetSrc = ""
) {
    const player = new Entity(spawnPosition, dimensions, "player"); // make a new game object with a position, size, and name
    player.setSpriteSheet(spriteSheetSrc); // set player image
    player.setUpdate(playerUpdate); // tell the game to call playerUpdate each frame
    player.elem.style.willChange = "transform"; // hint the browser we will move this object often

    addMovement(player, 350); // allow the player to move left/right at 350 px per second
    applyGravity(player, 1000); // give the player a gravity effect
    addJump(player, 400); // allow the player to jump with 400 power
    addDashing(player, 80); // allow the player to dash quickly
    player.noControl = false; // used to freeze controls during cutscenes
    player.lives = 3; // start with three lives

    addOffSet(player, {
        top: 5,
        right: 10,
        left: 10,
        bottom: 5
    }); // smaller collision box than the sprite itself, to make collisions fairer
    addCollisionDetect(player); // mark that the player can collide with other objects

    addAnimation(player, "idle", {
        row: 5,
        startFrame: 6,
        frameCount: 4,
        fps: 12
    }); // idle animation frames

    addAnimation(player, "run", {
        row: 0,
        startFrame: 0,
        frameCount: 8,
        fps: 12
    }); // running animation

    addAnimation(player, "fall", {
        row: 9,
        startFrame: 1,
        frameCount: 10,
        fps: 12
    }); // falling animation

    addAnimation(player, "jump", {
        row: 9,
        startFrame: 0,
        frameCount: 1,
        fps: 12
    }); // jump pose

    addAnimation(player, "climb", {
        row: 3,
        startFrame: 8,
        frameCount: 4,
        fps: 12
    }); // wall climbing animation

    addAnimation(player, "death", {
        row: 10,
        startFrame: 15,
        frameCount: 1,
        fps: 12
    }); // death animation frame

    addAnimation(player, "talk", {
        row: 8,
        startFrame: 0,
        frameCount: 2,
        fps: 8
    }); // talking animation

    addAnimation(player, "sit", {
        row: 8,
        startFrame: 8,
        frameCount: 1,
        fps: 8
    }); // sitting pose

    addAnimation(player, "dash", {
        row: 10,
        startFrame: 0,
        frameCount: 4,
        fps: 12
    }); // dash animation

    return player; // give the new player back to the game
}

export function playerUpdate(player, dt) {
    if (player.freeze) return; // if controls are frozen, do nothing
    if (!player.alive) {
        playerDeath(dt); // run death behavior when dead
        return;
    }
    let moving = false; // track whether the player is moving horizontally

    const touchingRightWall = isTouchingRightWall(player, mainLevel.entities); // check wall collision on the right
    const touchingLeftWall = isTouchingLeftWall(player, mainLevel.entities); // check wall collision on the left

    if (inputs.includes(keys.right)) { // if the right key is held
        if (touchingRightWall) {
            player.components.physics.gravity.vy = 0; // stop falling if on the wall
            player.position.y -= player.components.movement.climbSpeed * dt; // climb up the wall
        } else {
            player.position.x += player.components.movement.speed * dt; // move right
        }
        player.components.movement.direction = 1; // face right
        moving = true;
    }

    if (inputs.includes(keys.left) && player.position.x >= 0) { // if the left key is held and not past the left edge
        if (touchingLeftWall) {
            player.components.physics.gravity.vy = 0; // stop falling while on the wall
            player.position.y -= player.components.movement.climbSpeed * dt; // climb up
        } else {
            player.position.x -= player.components.movement.speed * dt; // move left
        }
        player.components.movement.direction = -1; // face left
        moving = true;
    }

    if (
        !player.components.physics.collision.right &&
        inputs.includes(keys.jump) &&
        !player.components.powers.jump.isJumping &&
        player.components.powers.jump.isJumping === false
    ) {
        // if jump button is pressed and we are not already in a jump
        player.components.physics.gravity.vy =
            -player.components.powers.jump.jumpPower; // push player up

        player.components.powers.jump.isJumping = true; // mark as jumping
        playSound(
            "assets/soundTrack/player/jump_dreamblock.wav"
        );
        playAnimation(player, "jump"); // show jump animation
    }

    const dashData = player.components.powers.dash; // read dash status
    if (
        inputs.includes(keys.dash) &&
        !dashData.isDashing &&
        !dashData.onCooldown
    ) {
        dash(player, dt); // start dash movement
        playSound(
            "assets/soundTrack/player/dash_pink_left.wav"
        );
    }
    renderSprite(player); // update the correct sprite frame for the current animation
    player.position.y += player.components.physics.gravity.vy * dt; // apply gravity movement

    if(player.components.powers.dash.isDashing) {
        playAnimation(player, "dash") // keep dash animation while dashing
        return; // skip other animation changes until dash ends
    }
    if ((player.components.physics.gravity.vy <= -300) ||
        (player.components.physics.gravity.vy >= 50)) {
        // if the player is moving fast up or down, show jump/fall
        if (
            player.components.physics.gravity.vy < 0
        ) {
            playAnimation(player, "jump");
        } else {
            playAnimation(player, "fall");
        }
    } else {
        if (moving) {
            if (player.components.physics.collision.right || player.components.physics.collision.left) {
                playAnimation(player, "climb"); // wall climb animation
            } else {
                playAnimation(player, "run"); // normal running animation
            }
        } else {
            if (player.noControl) return; // if controls are disabled, stay in current state
            playAnimation(player, "idle"); // show idle animation when not moving
        }
    }
}

function renderSprite(player) {
    const animation = player.components.animation; // animation data for this entity
    if (!animation) return; // if no animation is set, do nothing

    const sprite = animation.sprites[animation.state.sprite]; // current animation data
    if (!sprite) return;

    const frame = sprite.startFrame + animation.state.frame; // calculate which sprite frame to show
    const frameWidth = player.dimensions.width; // width of one single frame
    const frameHeight = player.dimensions.height; // height of one frame

    // move the background image so the correct frame is visible
    player.elem.style.backgroundPosition =
        `-${frame * frameWidth}px -${sprite.row * frameHeight}px`;
}

export function deathCount() {
    player.lives--; // lose one life
    if(player.lives <= 0) {
        stopGame(); // stop the animation loop
        showLoseScreen() // show game over screen
    }
    document.getElementById('live-count').textContent = `Lives: ${player.lives}`; // update the HUD
}

export async function playerDeath(dt) {
    renderSprite(player) // draw the current sprite frame while dying
    window.removeEventListener('keydown', detectInput) // stop reading keyboard input
    window.removeEventListener('keyup', removeKey);
    inputs.length = 0; // clear any held keys

    playAnimation(player, "death"); // play death animation

    player.position.y -= 350 * dt; // move the player slightly up while dying
    await wait(200); // pause for 0.2 seconds before continuing
}

function dash(player, dt) {
    const dash = player.components.powers.dash;
    const maxDistance = 15; // how far the dash will move

    dash.distanceTravelled = 0; // reset length
    dash.isDashing = true; // mark dash active

    let dx = 0;
    let dy = 0;

    if (inputs.includes(keys.left)) dx = -1; // move left if left key is held
    if (inputs.includes(keys.right)) dx = 1; // move right if right key is held
    if (inputs.includes(keys.jump)) dy = -1; // move up if jump key is held

    window.removeEventListener('keydown', detectInput); // temporarily stop normal key tracking
    window.removeEventListener('keyup', removeKey);
    if (dx === 0 && dy === 0) {
        dx = player.components.movement.direction; // if no direction key is held, dash the direction the player is facing
    }

    const length = Math.hypot(dx, dy); // distance of the dash direction vector

    if (length > 0) {
        dx /= length; // normalize direction so diagonal dashing is not faster
        dy /= length;
    }

    let loop;

    function perform() {
        player.components.physics.gravity.vy = 0; // ignore vertical gravity during dash
        const step = dash.dashPower; // how many pixels to move each step

        player.position.x += dx * step;
        player.position.y += dy * step;

        dash.distanceTravelled += step;

        if (dash.distanceTravelled >= maxDistance) {
            clearInterval(loop); // stop the dash loop

            dash.isDashing = false; // no longer dashing
            dash.onCooldown = true; // begin cooldown before next dash

            setTimeout(() => {
                dash.onCooldown = false; // allow dash again after 1 second
            }, 1000);
        }
    }

    loop = setInterval(perform, 100); // run the dash effect every 100 ms

    window.addEventListener('keydown', detectInput); // restore normal input handling
    window.addEventListener('keyup', removeKey);
}
