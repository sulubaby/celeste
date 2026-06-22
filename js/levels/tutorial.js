import { Entity } from "../entities/entity.js";
import { Level } from "../level.js";
import { bird, gameContainer, mainLevel, player } from "../main.js";
import { collision, gravity } from "../systems/physics.js";
import { animationSystem } from "../systems/animationSystem.js";
import { addAnimation, playAnimation } from "../components/animation.js";
import { createBird } from "../entities/bird.js";
import { playSound } from "../helpers/sound.js";
import { hideSign, showSign } from "../helpers/sign.js";
import { applyGravity } from "../components/physics.js";
import { playerDeath } from "../entities/player.js";

const fallingBlocks = createFallingBlock();
export let birdSounded = false;
let triggered = false;
let soundTriggered = false;
let death = false;

export async function createTutorial() {
    const response = await fetch("./js/data/levels.json");
    const levelData = await response.json();

    const level = new Level({ height: 550, width: 1200 }, gameContainer);
    level.addSystem(gravity);
    level.addEntity(player);
    level.addSystem(animationSystem);
    level.addEntity(bird);

    const house = new Entity({x: 4434,y: 200}, {height: 100, width: 500});
    house.elem.style.backgroundColor = 'red'
    house.setSpriteSheet("./assets/tiles/celeste/house.png");
    level.addEntity(house);

    console.log(house);
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