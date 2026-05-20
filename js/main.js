import { createPlayer } from "./core/entities/player.js";
import { input, setInputs } from "./core/input.js";

const container = document.querySelector('.game-container');

const player = createPlayer();

container.appendChild(player.element);
setInputs('w','d','a');

function game() {

    if (input["right"]) {
        player.x += player.speed;
    }
    if(input.left) {
        player.x -= player.speed;
    }

    player.element.style.transform =
        `translate(${player.x}px, ${player.y}px)`;

    requestAnimationFrame(game);
}

game();