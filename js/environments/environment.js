const platformLayer = document.getElementById("platform-layer");
const midLayer = document.getElementById("mid-layer");

export const platforms = [
  { x: 80, y: 500, width: 260, height: 30 },
  { x: 420, y: 430, width: 180, height: 30 },
  { x: 700, y: 360, width: 170, height: 30 },
  { x: 980, y: 470, width: 220, height: 30 },
  { x: 1300, y: 390, width: 180, height: 30 },
  { x: 1600, y: 520, width: 300, height: 30 }
];

const mountains = [
  { x: 100, y: 0 },
  { x: 500, y: 0 },
  { x: 900, y: 0 },
  { x: 1300, y: 0 }
];

export function createEnvironment() {
  createMountains();
  createPlatforms();
}

function createMountains() {
  mountains.forEach((mountain) => {
    const element = document.createElement("div");
    element.className = "mountain";
    element.style.transform = `translate(${mountain.x}px, ${mountain.y}px)`;
    midLayer.appendChild(element);
  });
}

function createPlatforms() {
  platforms.forEach((platform) => {
    const element = document.createElement("div");
    element.className = "platform";

    element.style.width = `${platform.width}px`;
    element.style.height = `${platform.height}px`;

    // transform is better for performance than constantly changing left/top
    element.style.transform = `translate(${platform.x}px, ${platform.y}px)`;

    platformLayer.appendChild(element);
  });
}