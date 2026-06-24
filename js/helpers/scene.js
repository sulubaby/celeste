import { playSound } from "../helpers/sound.js";

const dialogue = document.getElementById("dialogue");
const dialogueText = document.getElementById("dialogueText");
const dialogueImage = dialogue.querySelector("img");

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function showDialogue(text, image, sound = null) {
    dialogueText.textContent = text;
    dialogueImage.src = image;

    if (sound) {
        playSound(sound);
    }

    // Show
    dialogue.style.display = "flex";

    requestAnimationFrame(() => {
        dialogue.classList.remove("hidden");
    });

    // Stay visible
    await wait(2500);

    // Hide
    dialogue.classList.add("hidden");

    // Wait for the hide transition
    await wait(500);

    dialogue.style.display = "none";
}