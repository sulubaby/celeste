
export class Entity {
    id;

    position = {
        x: 0,
        y: 0
    };

    dimensions = {
        height: 0,
        width: 0
    };

    components = {};

    update;

    elem = document.createElement("div");

    #spritesheet = "";

    constructor(
        position = { x: 0, y: 0 },
        dimensions = { height: 0, width: 0 },
        id = ""
    ) {
        this.position = position;
        this.dimensions = dimensions;
        this.id = id;

        this.#initElement();
    }

    #initElement() {
        this.elem.style.height = `${this.dimensions.height}px`;
        this.elem.style.width = `${this.dimensions.width}px`;
        this.elem.style.transform =
            `translate(${this.position.x}px, ${this.position.y}px)`;

        this.elem.style.position = "absolute";
        this.elem.style.backgroundRepeat = "no-repeat";
        this.elem.style.imageRendering = "pixelated";
        this.elem.style.overflow = "hidden";
        this.elem.style.backgroundSize = "auto";
        this.elem.style.willChange = "transform";

        this.elem.id = this.id;
    }

    setSpriteSheet(spriteSheetSrc = "") {
        this.#spritesheet = spriteSheetSrc;
        this.elem.style.backgroundImage = `url(${spriteSheetSrc})`;
    }

    setScale(scale = 1) {
        this.elem.style.scale = scale;
    }
    render(parent) {
        parent.appendChild(this.elem);
    }

    updatePosition() {
        this.elem.style.transform =
            `translate(${this.position.x}px, ${this.position.y}px)`;
    }

    setUpdate(updateFunc) {
        this.update = updateFunc;
    }
}