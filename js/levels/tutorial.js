import { Entity } from "../entities/entity.js";
import { Level } from "../level.js";
import { bird, camera, gameContainer, mainLevel, player } from "../main.js";
import { collision, gravity } from "../systems/physics.js";
import { animationSystem } from "../systems/animationSystem.js";
import { addAnimation, playAnimation } from "../components/animation.js";
import { createBird } from "../entities/bird.js";
import { playSound } from "../helpers/sound.js";
import { hideSign, revealTitle, showSign } from "../helpers/sign.js";
import { applyGravity } from "../components/physics.js";
import { playerDeath } from "../entities/player.js";
import { inputs, keys } from "../systems/input.js";

const fallingBlocks = createFallingBlock();
let level;
export let birdSounded = false;
let triggered = false;
let soundTriggered = false;
let death = false;
let breakTrapTriggered = false;
let birdLanded = false;

let dashTutorial = false;
let positionX = 0;
let positionY = 0;

export async function createTutorial() {
    const response = await fetch("./js/data/levels.json");
    const levelData = await response.json();

    level = new Level({ height: 550, width: 1200 }, gameContainer);
    level.addSystem(gravity);

    level.addSystem(animationSystem);
    level.addEntity(bird);

    for (let i = 0; i < fallingBlocks.length; i++) {
        level.addEntity(fallingBlocks[i]);
    }


    Object.values(levelData.tutorial.tiles).forEach(tileData => {
        tileData.positions.forEach(position => {
            const tile = new Entity(
                {
                    x: position.x,
                    y: position.y - 200
                },
                {
                    height: tileData.dimensions.height,
                    width: tileData.dimensions.width
                },
            );
            if (tileData.class) {
                tileData.class.forEach((c) => {
                    tile.elem.classList.add(c);
                })
                tile.elem.classList.add("no-render");
            }
            tile.elem.style.backgroundSize = 'cover';
            tile.setSpriteSheet(tileData.path);
            level.addEntity(tile);
        });
    });
    level.addEntity(player);
    const grany = new Entity({ x: 4080, y: 100 }, { height: 80, width: 66.6 });
    grany.setSpriteSheet("./assets/tiles/grany.png");
    grany.setUpdate(granyUpdate);
    addAnimation(grany, "idle", {
        row: 0,
        frameCount: 7,
        startFrame: 0,
        fps: 12
    });
    playAnimation(grany, "idle");
    bird.components.movement = {
        direction: -1
    }
    level.addEntity(grany);

    level.setConditions(conditions);
    return level;
}

function conditions(dt) {
    // falling snow blocks
    if ((player.position.x >= 1100 || triggered)) {
        triggered = true;

        if (!(fallingBlocks[0].position.y >= 253)) {
            for (let i = 0; i < fallingBlocks.length; i++) {
                fallingBlocks[i].position.y += 280 * dt;
            }
        } else {
            if (!soundTriggered) { playSound("./assets/soundTrack/quack.wav"); soundTriggered = true };
        }

    }

    let sign = null;
    if (player.position.x >= 2200 && !birdSounded) {
        birdSounded = true;
        playAnimation(bird, "sound");
        playSound("./assets/soundTrack/bird/squawk.wav");
        setInterval(() => {
            playAnimation(bird, "idle");
        }, 500);

        sign = showSign("./assets/signs/climb.png", 950, 10, document.getElementById('game'));
        setInterval(() => {
            hideSign(sign);
        }, 2000);
    }

    if (player.position.y >= 500) {
        if (player.alive) playSound("./assets/soundTrack/player/death.wav");
        player.alive = false;
        if (!death) {
            death = true;
        }
    }

    if (player.position.x >= 1100 &&
        player.position.x <= 1247 &&
        player.position.y >= 206 &&
        player.position.y <= 253 &&
        fallingBlocks[0].position.y >= 189 &&
        fallingBlocks[0].position.y <= 250
    ) {
        if (player.alive) playSound("./assets/soundTrack/player/death.wav");


        player.alive = false;
    }
    breakTrap(player);

    if (player.position.x >= 6600 && player.position.y >= 400 && !dashTutorial) {
        player.freeze = true;
        dashTutorial = true;
        dashTutorialScene();
    }
    //7009 = x, y = 271
    if (dashTutorial && inputs.includes(keys.dash)) {

        player.freeze = false;
    }

    let loop;
    if (player.position.x >= 7001 && player.position.y <= 271) {
        player.freeze = true;
        playAnimation(player, "idle");
        function cameraMovement() {
            camera.position.y -= 3;
            if (camera.position.y <= -100) {
                clearInterval(loop);
                if (!level.end) {
                    revealTitle(document.getElementById('title'), 'YOU CAN DO IT');
                    level.end = true
                }
            }
        }

        loop = setInterval(cameraMovement, 40);
    }

}

function createFallingBlock() {
    const EdgeLeft = new Entity({ x: 1100, y: 0 }, { height: 50, width: 50 });
    EdgeLeft.setSpriteSheet("assets/tiles/celeste/blueIceEdgeLeft.png");
    EdgeLeft.elem.style.backgroundSize = 'cover';
    EdgeLeft.elem.classList.add('falling-snow');

    const topCenter = new Entity({ x: 1149, y: 0 }, { height: 50, width: 50 });
    topCenter.setSpriteSheet("assets/tiles/celeste/blueIce.png");
    topCenter.elem.style.backgroundSize = 'cover';
    topCenter.elem.classList.add('falling-snow');

    const EdgeRight = new Entity({ x: 1198, y: 0 }, { height: 50, width: 50 });
    EdgeRight.setSpriteSheet("assets/tiles/celeste/blueIceEdgeRight.png");
    EdgeRight.elem.style.backgroundSize = 'cover';
    EdgeRight.elem.classList.add('falling-snow');

    const EdgeBottomLeft = new Entity({ x: 1100, y: 49 }, { height: 50, width: 50 });
    EdgeBottomLeft.setSpriteSheet("assets/tiles/celeste/blueIceEdgeLeftBottom.png");
    EdgeBottomLeft.elem.style.backgroundSize = 'cover';
    EdgeBottomLeft.elem.classList.add('falling-snow');

    const bottomCenter = new Entity({ x: 1149, y: 49 }, { height: 50, width: 50 });
    bottomCenter.setSpriteSheet("assets/tiles/celeste/blueIceDown.png");
    bottomCenter.elem.style.backgroundSize = 'cover';
    bottomCenter.elem.classList.add('falling-snow');

    const EdgeBottomRight = new Entity({ x: 1198, y: 49 }, { height: 50, width: 50 });
    EdgeBottomRight.setSpriteSheet("assets/tiles/celeste/blueIceEdgeRightBototm.png");
    EdgeBottomRight.elem.style.backgroundSize = 'cover';
    EdgeBottomRight.elem.classList.add('falling-snow');


    return [EdgeBottomLeft, EdgeLeft, topCenter, EdgeRight, EdgeBottomRight, bottomCenter];
}

function breakTrap(player) {
    if (breakTrapTriggered) return;

    if (player.position.x >= 6500) {
        breakTrapTriggered = true;

        const arr = document.getElementsByClassName("fallingBreak");

        for (const elem of arr) {
            elem.classList.add("falling");
        }
        playSound("./assets/soundTrack/breakBridge.wav");

    }
}


function dashTutorialScene(dt) {
    // landing position x = 7100, y = 240
    const bird = new Entity({ x: 7200, y: 80 }, { height: 56, width: 64 }, "bird");
    bird.setSpriteSheet("./assets/bird.png");
    bird.elem.classList.add('none-collision');
    bird.components.movement = {
        direction: -1
    }
    bird.landed = false;

    addAnimation(bird, "idle", {
        row: 0,
        startFrame: 0,
        frameCount: 1,
        fps: 12
    });
    addAnimation(bird, "fly", {
        row: 0,
        startFrame: 32,
        frameCount: 5,
        fps: 12
    });

    addAnimation(bird, "sound", {
        row: 0,
        startFrame: 7,
        frameCount: 7,
        fps: 12
    });

    playAnimation(bird, "fly");

    const landing = {
        x: 7100,
        y: 240
    };

    const speed = 180;

    function birdUpdate(bird, dt) {
        const dx = landing.x - bird.position.x;
        const dy = landing.y - bird.position.y;

        const distance = Math.hypot(dx, dy);

        if (distance > 2) {
            bird.position.x += (dx / distance) * speed * dt;
            bird.position.y += (dy / distance) * speed * dt;
        } else {
            bird.position.x = landing.x;
            bird.position.y = landing.y;

            if (!birdLanded) {
                birdLanded = true;
                playSound("./assets/soundTrack/bird/squawk.wav");
                playAnimation(bird, "sound");
                const sign = new Entity({ x: 6970, y: 160 }, { height: 130, width: 220 }, "dashSign");
                sign.setSpriteSheet("./assets/signs/dash_sign.png");
                sign.elem.style.backgroundSize = 'cover';
                sign.elem.classList.add('none-collision');

                level.addEntity(sign);
                level.mountEntities();
                setTimeout(() => {
                    playAnimation(bird, "idle");
                }, 600);
            }
        }

        const animation = bird.components.animation;
        if (!animation) return;

        const sprite = animation.sprites[animation.state.sprite];
        if (!sprite) return;

        const frame = sprite.startFrame + animation.state.frame;

        bird.elem.style.backgroundPosition =
            `-${frame * bird.dimensions.width}px -${sprite.row * bird.dimensions.height}px`;
    }

    bird.setUpdate(birdUpdate);

    level.addEntity(bird);
    level.mountEntities();
}

function granyUpdate(grany) {
    const animation = grany.components.animation;

    if (!animation) return;

    const sprite =
        animation.sprites[
        animation.state.sprite
        ];

    if (!sprite) return;

    const frame =
        sprite.startFrame +
        animation.state.frame;

    const frameWidth =
        grany.dimensions.width;

    const frameHeight =
        grany.dimensions.height;

    grany.elem.style.backgroundPosition =
        `-${frame * frameWidth}px -${sprite.row * frameHeight}px`;
}