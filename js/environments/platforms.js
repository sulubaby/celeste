export const platforms = [
  { x: 300, y: 550, width: 200, height: 20, hidden: false },
  { x: 600, y: 450, width: 150, height: 20, hidden: false },
  { x: 900, y: 350, width: 120, height: 20, hidden: false },
  { x: 500, y: 250, width: 180, height: 20, hidden: false },
  { x: 750, y: 180, width: 140, height: 20, hidden: false },
  { x: 1050, y: 120, width: 200, height: 20, hidden: false },
];
class Platform { 

    
}
export function createPlatforms(game) {
  const groundHeight = 130;
  const groundPlatform = {
    x: 0,
    y: game.offsetHeight - groundHeight,
    width: game.offsetWidth,
    height: 20,
    hidden: false,
  };
  platforms.push(groundPlatform);

  platforms.forEach((platform) => {
    if (platform.hidden) return;

    const el = document.createElement("div");
    el.classList.add("platform");
    el.style.left = platform.x + "px";
    el.style.top = platform.y + "px";
    el.style.width = platform.width + "px";
    el.style.height = platform.height + "px";

    game.appendChild(el);
  });
}