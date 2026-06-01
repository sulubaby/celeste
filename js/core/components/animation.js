export function addAnimation(
    entity,
    spriteName,
    data = {
        row: 0,
        startFrame: 0,
        frameCount: 0,
        fps: 10
    }
) {
    entity.components ??= {};

    entity.components.animation ??= {
        state: {
            frame: 0,
            sprite: ""
        },
        sprites: {}
    };

    if (entity.components.animation.sprites[spriteName]) {
        return;
    }

    entity.components.animation.sprites[spriteName] = data;
}