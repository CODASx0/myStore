let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
}

function draw() {
  circle(mouseX, mouseY, 20);
}
