import { positions } from "../../data/data.js";

export const input = {
    left: false,
    right: false,
    jump: false
};

export function initInput(rightKey = "d", leftKey = "a", JumpKey = "w") {
    window.addEventListener('keydown', (e) => {
        if (e.key === rightKey) input.right = true;
        if (e.key === leftKey) input.left = true;
        if (e.key === JumpKey) input.jump = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === rightKey) input.right = false;
        if (e.key === leftKey) input.left = false;
        if (e.key === JumpKey) input.jump = false;
    });
}


