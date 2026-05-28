import { gravityData } from "../../data/data.js";


export function applyGravity(entityID = "", data = {gravityForce: 1000}) {
    gravityData[entityID] = data;
}