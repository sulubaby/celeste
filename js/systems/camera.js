
export class Camera {
    position = { x: 0, y: 0 };

    constructor(target) {
        this.target = target;

        this.CHUNK_WIDTH = 1200;
        this.CHUNK_HEIGHT = 500;

        this.chunkX = 0;
        this.chunkY = 0;
    }

    update() {
        if (!this.target) return;
        let playerX = this.position.x;
        let playerY = this.position.y;
        if (this.target) {
            playerX = this.target.position.x;
            playerY = this.target.position.y;
        }



        // Move right
        while (playerX >= (this.chunkX + 1) * this.CHUNK_WIDTH) {
            this.chunkX++;
        }

        // Move left
        while (playerX < this.chunkX * this.CHUNK_WIDTH) {
            this.chunkX--;
        }

        // Move down
        while (playerY >= (this.chunkY + 1) * this.CHUNK_HEIGHT) {
            this.chunkY++;
        }

        // Move up
        while (playerY < this.chunkY * this.CHUNK_HEIGHT) {
            this.chunkY--;
        }

        this.position.x = this.chunkX * this.CHUNK_WIDTH;
        this.position.y = this.chunkY * this.CHUNK_HEIGHT;
    }
}