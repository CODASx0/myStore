//窗口0:显示嘴唇图像切片
//窗口1:显示嘴唇信息在屏幕上的位置
//窗口2:显示嘴唇左右与上下定点的相对位置
//窗口3:显示嘴唇上下点形成的波形
//窗口4:显示动态网格与实验性字体
let video;


var windowProp;


let canvas;
let smoothX, smoothY, smooth = 0.1;
let font;

let tween = [];

let point = [{
  x: 100,
  y: 100,
}, {
  x: 120,
  y: 120
}, {
  x: 100,
  y: 100,
}, {
  x: 120,
  y: 120
}]

let TextInput = '';

let lipsInput = [];
let isRecording = false;


let isDeleting = false;
let deleteTime = 0;

function setup() {

  windowProp = [
    {
      width: 200,
      height: 200,
      posX: 260,
      posY: windowHeight / 2 - 100,
    }, {
      width: 200,
      height: 200,
      posX: 30,
      posY: windowHeight / 2 - 100,
    }, {
      width: 400,
      height: 200,
      posX: 490,
      posY: windowHeight / 2 - 100,
    }, {
      width: 400,
      height: 200,
      posX: 920,
      posY: windowHeight / 2 - 100,
    }
  ]

  startWebcam()

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  font = loadFont('assets/IBMPlexMono-Light.ttf');

  smoothX = mouseX;
  smoothY = mouseY;

}

function draw() {



  keyHoldTest()
  clear()
  if (video) {
    //image(video, 0, 0, 400, 300);
  }

  textFont(font);

  smoothX = lerp(smoothX, mouseX, smooth);
  smoothY = lerp(smoothY, mouseY, smooth);



  if (detections != undefined) {
    point[0].x = (1 - detections[13].x) * windowProp[0].width;
    point[0].y = detections[13].y * windowProp[0].height;
    point[1].x = (1 - detections[14].x) * windowProp[0].width;
    point[1].y = detections[14].y * windowProp[0].height;
    point[2].x = (1 - detections[61].x) * windowProp[1].width;
    point[2].y = detections[61].y * windowProp[1].height;
    point[3].x = (1 - detections[291].x) * windowProp[1].width;
    point[3].y = detections[291].y * windowProp[1].height;

    recordDetection()

  }

  windowRect(windowProp[0].posX, windowProp[0].posY, windowProp[0].width, windowProp[0].height, [
    [point[0].x, point[0].y],
    [point[1].x, point[1].y],
  ]);

  windowRect(windowProp[1].posX, windowProp[1].posY, windowProp[1].width, windowProp[1].height, [
    [point[2].x, point[2].y],
    [point[3].x, point[3].y],
  ]);

  windowRect(windowProp[2].posX, windowProp[2].posY, windowProp[2].width, windowProp[2].height, [

  ]);

  //windowRect(windowProp[3].posX, windowProp[3].posY, windowProp[3].width, windowProp[3].height, []);

  windowRecord(windowProp[2], lipsInput);

  drawMeshTypeAdvance(TextInput, windowProp[3], lipsInput);

  textSize(20)
  //text(TextInput, 30, 30)


  //line(point[0].x+windowProp[0].posX, point[0].y+windowProp[0].posY, point[1].x+windowProp[0].posX, point[1].y+windowProp[0].posY);



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

function keyPressed() {
  if (key === ';') {
    tween.forEach(t => t.kill())
    tween[0] = gsap.to(windowProp[0], {
      width: 0,
      height: 160,
      posX: 320 + 75,
      posY: windowHeight / 2 - 80,
      duration: 0.5,
      ease: "expo.out",
    })
    tween[1] = gsap.to(windowProp[1], {
      width: 160,
      height: 0,
      posX: 160,
      posY: windowHeight / 2,
      duration: 0.7,
      ease: "expo.out",
    })
    tween[2] = gsap.to(windowProp[2], {
      width: 400 + 40,
      height: 300,
      posX: 490 - 20,
      posY: windowHeight / 2 - 150,
      duration: 0.9,
      ease: "expo.out",
    })



    lipsInput = [];
    lipsInput.push(new LipsData(JSON.parse(JSON.stringify(detections))));
    isRecording = true;

  }
  if (key === 'Backspace') {
    //删除最后一个字符
    TextInput = TextInput.slice(0, TextInput.length - 1);
    console.log(TextInput);
    isDeleting = true;
    deleteTime = frameCount;

  }
}

function keyReleased() {
  if (key === ';') {
    tween.forEach(t => t.kill())
    tween[0] = gsap.to(windowProp[0], {
      width: 200,
      height: 200,
      posX: 260,
      posY: windowHeight / 2 - 100,
      duration: 0.8,
      ease: "expo.out",
    })
    tween[1] = gsap.to(windowProp[1], {
      width: 200,
      height: 200,
      posX: 30,
      posY: windowHeight / 2 - 100,
      duration: 1,
      ease: "expo.out",
    })
    tween[2] = gsap.to(windowProp[2], {
      width: 400,
      height: 200,
      posX: 490,
      posY: windowHeight / 2 - 100,
      duration: 1.2,
      ease: "expo.out",
    })

    isRecording = false;
  }

  if (key === 'Backspace') {

    isDeleting = false;

  }
}


async function startWebcam() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');

  // 选择第二个视频输入设备
  const constraints = {
    video: {
      deviceId: videoDevices[1].deviceId
    }
  };

  video = createCapture(constraints);
  video.hide();
}


function recordDetection() {
  if (isRecording) {
    lipsInput.push(new LipsData(JSON.parse(JSON.stringify(detections))));
  }
}

//监测键盘输入字符串
function keyTyped() {
  //转大写字母
  key = key.toUpperCase();
  //判断是否是字母
  if (key >= 'A' && key <= 'Z') {
    TextInput += key;
  }


  console.log(TextInput);
}


//检测backspace键长按时常并删除字符
function keyHoldTest() {
  let holdTime = frameCount - deleteTime;
  if (isDeleting && holdTime > 29) {
    if (holdTime % 3 == 0) {
      TextInput = TextInput.slice(0, TextInput.length - 1);
      console.log(TextInput);
    }
  }
}

//调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
