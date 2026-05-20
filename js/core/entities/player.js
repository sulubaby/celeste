export function createPlayer(spawnX = 0, spawnY = 0, playerSpeed = 5) {
    const element = document.createElement('div');

    element.classList.add('player');

    return {
        element,
        x : spawnX,
        y : spawnY, 
        speed : playerSpeed
    }
}