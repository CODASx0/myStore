
var windowProp = {
  width: 200,
  height: 200,
  posX: 30,
  posY: 30,
}

let canvas;
let smoothX, smoothY, smooth = 0.3;
let font;

let point = [{
  x: 100,
  y: 100,
}, {
  x: 120,
  y: 120
}]

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  font = loadFont('assets/IBMPlexMono-Light.ttf');

  smoothX = mouseX;
  smoothY = mouseY;
}

function draw() {
  clear()
  textFont(font);

  smoothX = lerp(smoothX, mouseX, smooth);
  smoothY = lerp(smoothY, mouseY, smooth);

  /*
  let point[0] = {
    x: 150 + cos(frameCount * 0.02) * 40,
    y: 150 + sin(frameCount * 0.02) * 100
  }
  let point[1] = {
    x: 150 + cos(frameCount * 0.025) * 100,
    y: 150 + sin(frameCount * 0.025) * 40
  }
  */

  //演示


  /*
    if (frameCount % 60 == 1) {
      gsap.to(windowProp, {
        width: random(100, 300),
        height: random(100, 300),
        posX: point[0].x - 100,
        posY: point[0].y - 100,
        duration: 1,
        ease: "expo.out"
      });
    }
    */

  if (detections != undefined) {
    point[0].x = (1 - detections[13].x) * windowProp.width + windowProp.posX;
    point[0].y = detections[13].y * windowProp.height + windowProp.posY;
    point[1].x = (1 - detections[14].x) * windowProp.width + windowProp.posX;
    point[1].y = detections[14].y * windowProp.height + windowProp.posY;
  }

  windowRect(windowProp.posX, windowProp.posY, windowProp.width, windowProp.height, [
    [point[0].x - windowProp.posX, point[0].y - windowProp.posY],
    [point[1].x - windowProp.posX, point[1].y - windowProp.posY],
  ]);

  windowRect(260, windowProp.posY, 400, windowProp.height, [

  ]);


  line(point[0].x, point[0].y, point[1].x, point[1].y);
  ellipse(point[0].x, point[0].y, 10, 10);
  ellipse(point[1].x, point[1].y, 10, 10);

  fill(255, 80);
  noStroke()

  text(round(point[0].x) + ',' + round(point[0].y), point[0].x, point[0].y)
  text(round(point[1].x) + ',' + round(point[1].y), point[1].x, point[1].y)

  //circle(mouseX, mouseY, 20);

  /*
  drawMeshType('K', 0, 0,
    [
      mySin(0), mySin(1), mySin(2), mySin(3), mySin(4), 10
    ],
    [
      20, 20, 40, 10, 30, 20, 20, 20
    ], 0);
  let posX = mySin(0) + mySin(1) + mySin(2) + mySin(3) + mySin(4) + mySin(5) + 50
  console.log(posX)
  
  drawMeshType('A', posX, 50,
    [
      mySin(6), mySin(7), mySin(8), mySin(9), mySin(10), 10
    ],
    [
      20, 0, 20, 20, 20, 0, 20, 20
    ], 0);
  */

}

function mySin(x) {
  return sin(x * 0.8 + frameCount * 0.03) * 8 + 40
}




