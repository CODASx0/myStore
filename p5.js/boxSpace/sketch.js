let cam;
let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.id("canvas");
  cam = createCamera();
  cam.setPosition(0, 0, 50);
  perspective(PI * 3 / 5, width / height, 0.1, 1000);

}



function draw() {
  clear();

  push();
  translate(0, 50, 0);
  //rotateX(PI / 2);
  //rect(-50, -50, 100, 100);

  for (let i = 0; i < 10; i++) {
    //在空间中随机创建10个圆形
    push();
    
    rotateX(frameCount * 0.01);

    ellipse(0, 0, 100, 100);
    pop();
    
    

  }

  pop();

}



//调整窗口大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  perspective(PI * 3 / 5, width / height, 0.1, 1000);
}