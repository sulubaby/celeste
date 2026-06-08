export class Camera {
    position = { x: 0, y: 0 };

    constructor(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;

        let x = this.target.position.x - halfW;
        let y = this.target.position.y - halfH;

        if (x < 0) x = 0;
        if (y < 0) y = 0;

        this.position.x = x;
        this.position.y = y;
    }
}
