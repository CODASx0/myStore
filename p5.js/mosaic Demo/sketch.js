


var mMeshSize = 40
let xNum = 1;
let yNum = 1;
var mMeshArray = []

class mMesh {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.completion = 0;
    this.size = size;

  }
  draw() {
    push()
    translate(this.x, this.y);
    translate(this.size / 2, this.size / 2);
    rotate(this.rotation);
    rect(-this.size / 2, -this.size / 2, this.size * this.completion, this.size);
    pop()
  }

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");

  xNum = Math.round(width / mMeshSize);
  yNum = Math.round(height / mMeshSize);
  mMeshArray = new Array(xNum);
  for (var i = 0; i < xNum; i++) {
    mMeshArray[i] = new Array(yNum);
    for (var j = 0; j < yNum; j++) {
      mMeshArray[i][j] = new mMesh(i * mMeshSize, j * mMeshSize, mMeshSize);
    }
  }
}



function draw() {
  clear();
  for (var i = 0; i < xNum; i++) {
    for (var j = 0; j < yNum; j++) {
      fill(20);
      stroke(0);
      fill(0)
      mMeshArray[i][j].draw();
    }
  }

}

//鼠标点击时候触发
let isOn = 1
let speed = 0.1
function mousePressed() {

  for (var i = 0; i < xNum; i++) {
    for (var j = 0; j < yNum; j++) {
      angleMode();
      let v0 = createVector(1, 0)
      let v1 = createVector(i, j)
      let angle = v0.angleBetween(v1)
      gsap.set(mMeshArray[i][j], {
        //按照生长方向旋转
        rotation: random() > 0.5 ? 0: PI / 2,
      });
      gsap.to(mMeshArray[i][j], {
        duration: speed,
        completion: isOn * (random() > 0.5 ? 1 : 1),
        delay: (i+j) * speed,
        
      });
    }
  }
  isOn = 1 - isOn
}
