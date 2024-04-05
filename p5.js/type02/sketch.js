
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


//窗口基准值
let windowsBase = {
  padding: 30,
  col1: 400,
}

let windowsProp = {
  window1: {
    posX: windowsBase.padding,
    posY: windowsBase.padding,
    width: windowsBase.col1,
    height: windowsBase.col1 / 4 * 3,
  },
  window2: {
    
  }
}

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
    }, {
      width: 400,
      height: 300,
      posX: 30,
      posY: windowHeight / 2 - 100 - 330,
    }
  ]

  startP5jsWebcam()

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  font = loadFont('assets/IBMPlexMono-Light.ttf');
  frameRate(60)

  smoothX = mouseX;
  smoothY = mouseY;

}

function draw() {


  clear()

  //translate(-windowWidth/2, -windowHeight/2)
  keyHoldTest()


  if (isWaiting) {
    console.log('waiting')
  }




  if (video && detections) {
    //image(video,0,0,300,300)
    let tempInput = new LipsData(JSON.parse(JSON.stringify(detections)));
    let sx = tempInput.left.x
    let sy = tempInput.outTop.y
    let sw = tempInput.right.x - tempInput.left.x
    let sh = tempInput.outBottom.y - tempInput.outTop.y


    image(
      video,
      windowProp[4].posX + windowProp[4].width * sx,
      windowProp[4].posY + windowProp[4].height * sy,
      windowProp[4].width * sw,
      windowProp[4].height * sh,
      sx * video.width,
      sy * video.height,
      sw * video.width,
      sh * video.height
    )

  }
  textFont(font);

  smoothX = lerp(smoothX, mouseX, smooth);
  smoothY = lerp(smoothY, mouseY, smooth);


  if (mouseProp.isPressed) {
    //fill(255)
    mouseProp.windowWidth = mouseX - mouseProp.posX0;
    mouseProp.windowHeight = mouseY - mouseProp.posY0;
    let posX = mouseProp.posX0;
    let posY = mouseProp.posY0;
    if (mouseProp.windowWidth < 0) {
      mouseProp.windowWidth = -mouseProp.windowWidth;
      posX = mouseX;
    }
    if (mouseProp.windowHeight < 0) {
      mouseProp.windowHeight = -mouseProp.windowHeight;
      posY = mouseY;
    }

    //windowRect(posX, posY, mouseProp.windowWidth, mouseProp.windowHeight, [])

    gsap.to(windowProp[3], {
      width: mouseProp.windowWidth,
      height: mouseProp.windowHeight,
      posX: posX,
      posY: posY,
      duration: 0.5,
      ease: "expo.out",
    })
  }

  if (detections != undefined) {
    recordDetection()
  }


  windowRect(windowProp[2].posX, windowProp[2].posY, windowProp[2].width, windowProp[2].height, [

  ]);

  windowRect(windowProp[3].posX, windowProp[3].posY, windowProp[3].width, windowProp[3].height, []);



  windowRecord(windowProp[2], lipsInput);


  drawMeshTypeAdvance(TextInput, windowProp[3], lipsInput);

  windowRect(windowProp[4].posX, windowProp[4].posY, windowProp[4].width, windowProp[4].height, []);

  textSize(20)


}

function mySin(x) {
  return sin(x * 0.8 + frameCount * 0.03) * 8 + 40
}

function keyPressed() {
  if (key === ';') {
    startRecording();

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
    stopRecording();

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
  if (isDeleting && holdTime > 16) {
    if (holdTime % 1 == 0) {
      TextInput = TextInput.slice(0, TextInput.length - 1);
      console.log(TextInput);
    }
  }
}

//调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//鼠标按下时记录位置
function mousePressed() {
  mouseProp.isPressed = true;
  mouseProp.posX0 = mouseX;
  mouseProp.posY0 = mouseY;

}


function mouseReleased() {
  mouseProp.isPressed = false;

}