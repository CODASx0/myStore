let VCam

let cam;
let canvas;



var VBox = {
  w: 1080,
  h: 1920,
  z: 1080
}

var mouse = {
  posZ: -200,
}



// 因为perspective函数会报错，所以这里用了一个变量来存储fov的值


function setup() {
  VCam = {
    fov: PI / 3,
    z: VBox.z * 0.5 * (sqrt(3) - 1),
  }

  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.id("canvas");
  cam = createCamera();
  cam.setPosition(0, 0, VCam.z);


}



function draw() {
  cam.setPosition(0, 0, VCam.z);
  perspective(VCam.fov, width / height, 0.1, 10000);
  
  clear();



  //rotateX(frameCount * 0.01);
  push()
  translate(0, 0, -VBox.z)
  //ellipse(0, 0, 100, 100);

  if (detections != undefined) {
    updateDetections(detections);

    lips[0] = new myLips(smoothedDetections, false, frameCount);
    fill(255, 255);
    noStroke();
    lips[0].drawM(-200, -200, 400, 320);


  }
  pop()

  drawSpaceLine(VBox.w, VBox.h, VBox.z*2, 5, 5, 10, 20, 2);

}

function keyPressed() {
  if ((key === ' ') && detections != undefined) {
    //按下空格键键开始录制
    //lipsArray[lipsArray.length] = new Array(timeSetup);
    //lipsArray[lipsArray.length - 1][0] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
    isRecording = true;

    gsap.to(VCam, {
      fov: PI * 2 / 3,
      duration: 1,
      z: -VBox.z * 0.5 * (1 - 1 / sqrt(3)),
      ease: "expo.out"
    });
    gsap.to(mouse, {
      posZ: 100,
      duration: 1,
      ease: "expo.out"
    });
  }
}

function keyReleased() {
  if (key === ' ') {
    isRecording = false;
    returnReady = false;

    
    gsap.to(VCam, {
      fov: PI / 3,
      duration: 0.6,
      z: VBox.z * 0.5 * (sqrt(3) - 1),
      ease: "expo.out"
    });
    gsap.to(mouse, {
      posZ: -200,
      duration: 1,
      ease: "expo.out"
    });
  }
  
}

//鼠标被按下
function mousePressed() {
  gsap.to(VCam, {
    fov: PI * 2/3,
    duration: 1,
    z: -VBox.z * 0.5 * (1 - 1 / sqrt(3)),
    ease: "expo.out"
  });
  gsap.to(mouse, {
    posZ: 100,
    duration: 1,
    ease: "expo.out"
  });
}

//鼠标被释放
function mouseReleased() {
  gsap.to(VCam, {
    fov: PI / 3,
    duration: 0.6,
    z: VBox.z * 0.5 * (sqrt(3) - 1),
    ease: "expo.out"
  });
  gsap.to(mouse, {
    posZ: -200,
    duration: 1,
    ease: "expo.out"
  });
}

//调整窗口大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  perspective(VCam.fov, width / height, 0.1, 1000);
}

