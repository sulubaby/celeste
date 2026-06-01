import { player } from "../../main.js";

export class Player {
    position = {
        x: 0,
        y: 0
    };

    dimensions = {
        height: 0,
        width: 0
    };

    components = {
        speed: 500,
    };

    playerElemant = document.createElement("div");
    #spritesheet;

    constructor(
        position = { x: 0, y: 0 },
        dimensions = { height: 0, width: 0 },
        components = { speed: 500 }
    ) {
        this.position.x = position.x;
        this.position.y = position.y;

        this.dimensions.height = dimensions.height;
        this.dimensions.width = dimensions.width;

        this.components.speed = components.speed ?? 500;

        this.#initElemant();
    }

    #initElemant() {
        this.playerElemant.style.height = `${this.dimensions.height}px`;
        this.playerElemant.style.width = `${this.dimensions.width}px`;
        this.playerElemant.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.playerElemant.style.position = "absolute";
        this.playerElemant.style.backgroundRepeat = "no-repeat";
        this.playerElemant.style.imageRendering = "pixelated";
        this.playerElemant.style.overflow = "hidden";
        this.playerElemant.style.backgroundSize = "auto";
        this.playerElemant.style.willChange = "transform";
        this.playerElemant.style.scale = "0.7";
        this.playerElemant.id = "player";
    }

    setSpriteSheet(spriteSheet = "") {
        this.#spritesheet = spriteSheet;
        this.playerElemant.style.backgroundImage = `url(${spriteSheet})`;
    }

    appendPlayer(parent = document.body) {
        parent.appendChild(this.playerElemant);
    }

    update() {
        this.playerElemant.style.transform =
            `translate(${this.position.x}px, ${this.position.y}px)`;
    }
}
