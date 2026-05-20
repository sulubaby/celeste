export const input = {};

export function setInputs(jumpBtn, rightBtn, leftBtn) {

    window.addEventListener('keydown', (e) => {

        if (e.key === jumpBtn) {
            input.jump = true;
        }

        if (e.key === rightBtn) {
            input.right = true;
        }

        if (e.key === leftBtn) {
            input.left = true;
        }

    });

    window.addEventListener('keyup', (e) => {

        if (e.key === jumpBtn) {
            input.jump = false;
        }

        if (e.key === rightBtn) {
            input.right = false;
        }

        if (e.key === leftBtn) {
            input.left = false;
        }

    });

}