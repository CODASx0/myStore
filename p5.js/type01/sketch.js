let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
}

function draw() {
  clear()
  //circle(mouseX, mouseY, 20);

  drawMesh('B', 50, 50,
    [
      mySin(0), mySin(1), mySin(2), mySin(3), 10, 0
    ],
    [
      10,10,10,10,10,10,10,10
    ], 0);
}

function mySin(x) {
  return sin(x * 1.2 + frameCount * 0.03) * 30 + 40
}


