export const keys = {
    left: "a",
    right: "d",
    jump: "w",
    dash: "q"
};

export const input = [];

export function initInput(leftKey = "a", rightKey = "d", jumpKey = "w", dashKey = "q") {
    keys.left = leftKey;
    keys.right = rightKey;
    keys.jump = jumpKey;
    keys.dash = dashKey;

    window.addEventListener("keydown", detectInput);
    window.addEventListener("keyup", removeKey);
}

export function detectInput(e) {
    if (!input.includes(e.key)) {
        input.push(e.key);
    }
}

function removeKey(e) {
    const index = input.indexOf(e.key);
    if (index !== -1) {
        input.splice(index, 1);
    }
}