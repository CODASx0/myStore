let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
}

function draw() {
  clear()
  //circle(mouseX, mouseY, 20);

  drawMeshType('K', 50, 50,
    [
      mySin(0), mySin(1), mySin(2), mySin(3), mySin(4), 10
    ],
    [
      20, 20, 40, 10, 30, 20, 10, 20
    ], 0);
  let posX = mySin(0) + mySin(1) + mySin(2) + mySin(3) + mySin(4) + mySin(5) + 50
  console.log(posX)
  drawMeshType('A', posX, 50,
    [
      mySin(6), mySin(7), mySin(8), mySin(9), mySin(10), 10
    ],
    [
      20, 10, 20, 20, 20, 10, 20, 20
    ], 0);
}

function mySin(x) {
  return sin(x * 0.8 + frameCount * 0.03) * 8 + 40
}


