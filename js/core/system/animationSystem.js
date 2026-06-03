export function animationSystem(dt, entity) {

    const animation = entity.components?.animation;

    if (!animation) return;

    const currentSprite =
        animation.sprites[animation.state.sprite];

    if (!currentSprite) return;

    dt /= 1000;

    animation.state.timer += dt;

    const frameDuration = 1 / currentSprite.fps;

    while (animation.state.timer >= frameDuration) {

        animation.state.timer -= frameDuration;

        animation.state.frame++;

        if (animation.state.frame >= currentSprite.frameCount) {
            animation.state.frame = 0;
        }
    }
}