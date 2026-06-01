export const keys = {
    left: "a",
    right: "d",
    jump: "w",
    dash: "Shift"
};

export const input = [];

export function initInput(leftKey = "a", rightKey = "d", jumpKey = "w", dashKey = "Shift") {
    keys.left = leftKey;
    keys.right = rightKey;
    keys.jump = jumpKey;
    keys.dash = dashKey;

    window.addEventListener("keydown", detectInput);
    window.addEventListener("keyup", removeKey);
}

function detectInput(e) {
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