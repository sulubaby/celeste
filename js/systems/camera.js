export class Camera {
    position = { x: 0, y: 0 };

    constructor(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        const SCREEN_WIDTH = 1200;
        const TRANSITION = 100;

        const playerX = this.target.position.x;

        const chunk = Math.floor(playerX / SCREEN_WIDTH);
        const chunkStart = chunk * SCREEN_WIDTH;
        const chunkEnd = chunkStart + SCREEN_WIDTH;

        let cameraX = chunkStart;

        if (playerX > chunkEnd - TRANSITION) {
            const t = (playerX - (chunkEnd - TRANSITION)) / TRANSITION;

            cameraX = chunkStart + t * SCREEN_WIDTH;
        }

        this.position.x = cameraX;
    }
}