//窗口0:显示嘴唇图像切片
//窗口1:显示嘴唇信息在屏幕上的位置
//窗口2:显示嘴唇左右与上下定点的相对位置
//窗口3:显示嘴唇上下点形成的波形
//窗口4:显示动态网格与实验性字体

var windowProp = {
  width: 0,
  height: 100,
  posX: 130,
  posY: 80,
}

let tl=gsap.timeline({repeat:-1,repeatDelay:1})
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
  
  tl.to(windowProp, {
    duration: 1,
    width: 200,
    height: 200,
    posX: 30,
    posY: 30,
    ease: "power2.inOut"
  });

  tl.to(windowProp, {
    duration: 1,
    width: 0,
    height: 100,
    posX: 130,
    posY: 80,
    ease: "power2.inOut"
  });
}

function draw() {
  clear()
  textFont(font);

  smoothX = lerp(smoothX, mouseX, smooth);
  smoothY = lerp(smoothY, mouseY, smooth);



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

  windowRect(30, 260, 400 + 230, 400, [
    
  ]);


  line(point[0].x, point[0].y, point[1].x, point[1].y);



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






