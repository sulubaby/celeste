import { animationData, animationState } from "../../data/data.js";

export function addAnimation(entityID, spriteName, data = {
    row: 0,
    startFrame: 0,
    frameCount: 0,
    fps: 10
}) {
    if(!animationData[entityID]) {
        animationData[entityID] = {};
    }
    animationData[entityID][spriteName] = data;

    if(!animationState[entityID]) {
        animationState[entityID] = {
            spriteName: spriteName,
            frame: 0
        };
    }
}