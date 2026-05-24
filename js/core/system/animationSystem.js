import { animationState, animationData } from "../../data/data.js";

export function animationSystem(dt) {

    Object.keys(animationState).forEach((entityID) => {

        const state = animationState[entityID];
        const anim = animationData[entityID][state.spriteName];

        if (!state.timer) {
            state.timer = 0;
        }

        state.timer += dt;

        if (state.timer >= 1000 / anim.fps) {

            state.timer = 0;

            state.frame++;

            if (state.frame >= anim.frameCount) {
                state.frame = 0;
            }
        }
    });
}