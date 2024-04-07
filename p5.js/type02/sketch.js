
let video;


let canvas;


let font;

let tween = [];


//文本输入
let TextInput = '';

//嘴部输入
let lipsInput = [];
let isRecording = false;

//删除检测
let isDeleting = false;
let deleteTime = 0;


//窗口基准值
let windowsBase = {
  padding: 30,
  col1: 200,
  state: 0
}

let windowsProp

function setup() {

  startP5jsWebcam()
  pixelDensity(3)

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  font = loadFont('assets/IBMPlexMono-Light.ttf');
  textFont(font);

  frameRate(60)

  smoothX = mouseX;
  smoothY = mouseY;

}

function draw() {
  windowsUpdate()

  clear()

  keyHoldTest()


  if (isWaiting) {
    console.log('waiting')
  }


  //windowRectBasic(windowsProp.window2.posX, windowsProp.window2.posY, windowsProp.window2.width, windowsProp.window2.height, 6 + 40 * windowsBase.state)
  ImagePreview(windowsBase.state)


  if (detections != undefined) {
    recordDetection()
  }

  LipsPreview(lipsInput)


}



function windowsUpdate() {
  windowsProp = {
    window1: {
      posX: windowsBase.padding,
      posY: windowsBase.padding,
      width: windowsBase.col1,
      height: windowsBase.col1 / 4 * 3,
    },
    window2: {
      posX: windowsBase.padding,
      posY: windowsBase.padding * 2 + windowsBase.col1 / 4 * 3,
      width: windowWidth - windowsBase.padding * 2,
      height: windowHeight - windowsBase.padding * 3 - windowsBase.col1 / 4 * 3,
    }
  }
}

function LipsPreview(lipsInput) {
  let step = 1
  let posX = windowsProp.window2.posX + windowsBase.state * 40
  let posX0 = 0
  let unit = 0
  let posY = windowsProp.window2.posY + windowsBase.state * 40
  let posY0 = 0
  let widthMin
  let ratio = 0.1
  let height = 0
  let width = 0

  let padding = 20


  //先遍历一遍找到最小的宽度，以及最上的坐标并进行修正，以及总体的宽度----非常重要----
  if (lipsInput != undefined && lipsInput.length > 0) {
    widthMin = lipsInput[0].img.width


    for (let i = 0; i < lipsInput.length; i += step) {
      if (lipsInput[i].img.width < widthMin) {
        widthMin = lipsInput[i].img.width
      }
      if (lipsInput[i].centerY - lipsInput[0].centerY < 0) {
        posY0 = Math.max(-(lipsInput[i].centerY - lipsInput[0].centerY), posY0)
      }

    }

    for (let i = 0; i < lipsInput.length; i += step) {
      lipsInput[i].posX0 = width
      lipsInput[i].posY0 = posY0 + lipsInput[i].centerY - lipsInput[0].centerY,

        height = Math.max(posY0 + lipsInput[i].centerY - lipsInput[0].centerY + lipsInput[i].img.height, height)
      unit = 4 * step + (lipsInput[i].img.width - widthMin) * ratio
      lipsInput[i].width0 = unit
      width += unit
    }
  }



  if (true) {
    //时间轴
    let textColor = 100
    let length = 6
    stroke(0)
    strokeWeight(0.5)
    line(posX, posY, posX + width + padding * 2, posY)
    line(posX, posY, posX, posY + length)

    for (let i = 0; i < lipsInput.length; i += step) {
      posX0 = lipsInput[i].posX0
      unit = lipsInput[i].width0
      if (i % (30 / step) == 0) {
        stroke(0)
        line(posX + posX0 + padding, posY, posX + posX0 + padding, posY - length)
        //line(posX + posX0 + padding - length, posY, posX + posX0 + padding + length, posY)
        textSize(8)
        fill(textColor)
        noStroke()
        text(i / 60 + 's', posX + posX0 + padding, posY - 12)
      }
    }

    stroke(0)
    line(posX + padding + width, posY, posX + padding + width, posY - length)
    //line(posX + padding + width - length, posY, posX + padding + width + length, posY)

    textSize(8)
    fill(textColor)
    noStroke()
    let timeNow = (lipsInput.length / 60).toFixed(1)
    text(timeNow + 's', posX + width + padding, posY - 12)

  }

  posX += padding
  posY += padding


  for (let i = 0; i < lipsInput.length; i += step) {
    unit = lipsInput[i].width0

    let unit0 = unit + 1
    image(lipsInput[i].img,
      posX + lipsInput[i].posX0,
      posY + lipsInput[i].posY0,
      unit0,
      lipsInput[i].img.height,
      lipsInput[i].img.width / 2 - unit0 * 0.5,
      0,
      unit,
      lipsInput[i].img.height)

  }

  posX -= padding
  posY += 240 + padding

  if (false) {
    //时间轴
    let length = 4
    stroke(200)
    strokeWeight(2)
    line(posX, posY, posX + width + padding * 2, posY)


    for (let i = 0; i < lipsInput.length; i += step) {
      unit = lipsInput[i].width0
      posX0 = lipsInput[i].posX0
      if (i % (30 / step) == 0) {
        stroke(160)
        line(posX + posX0 + padding, posY, posX + posX0 + padding, posY + length)
        line(posX + posX0 + padding - length, posY, posX + posX0 + padding + length, posY)
        textSize(12)
        fill(200)
        noStroke()
        text(i / 60 + 's', posX + posX0 + padding + 4, posY + 16)
      }
    }

    stroke(160)
    line(posX + padding + width, posY, posX + padding + width, posY + length)
    line(posX + padding + width - length, posY, posX + padding + width + length, posY)

    textSize(12)
    fill(200)
    noStroke()
    let timeNow = (lipsInput.length / 60).toFixed(1)
    text(timeNow + 's', posX + posX0 + padding + 4, posY + 16)

  }

  posX += padding
  posY += padding
  drawMeshTypeAdvanceV3(posX, posY + 5, lipsInput, TextInput, 0, 1)
  drawMeshTypeAdvanceV31(posX, posY + 5, lipsInput, TextInput, 0)




}


function ImagePreview(ratioInput) {
  let padding = 40;

  
  windowRectBasic(windowsProp.window1.posX, windowsProp.window1.posY, windowsProp.window1.width, windowsProp.window1.height, 6 + padding * ratioInput)
  windowRectBasicV2(windowsProp.window1.posX + padding * ratioInput,
    windowsProp.window1.posY + padding * ratioInput,
    windowsProp.window1.width - padding * 2 * ratioInput,
    windowsProp.window1.height - padding * 2 * ratioInput, 6)

  let ratio = (ratioInput + 2);
  if (video && detections) {
    //image(video,0,0,300,300)
    let tempInput = new LipsData(JSON.parse(JSON.stringify(detections)), video);
    let sx = tempInput.left.x
    let sy = tempInput.outTop.y
    let sw = tempInput.right.x - tempInput.left.x
    let sh = tempInput.outBottom.y - tempInput.outTop.y

    let leftY = tempInput.left.y - tempInput.outTop.y
    let rightY = tempInput.right.y - tempInput.outTop.y
    let topX = tempInput.inTop.x - tempInput.left.x
    let topY = tempInput.inTop.y - tempInput.outTop.y
    let bottomX = tempInput.inBottom.x - tempInput.left.x
    let bottomY = tempInput.inBottom.y - tempInput.outTop.y



    image(
      video,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * sw * ratio,
      windowsProp.window1.height * sh * ratio,
      sx * video.width,
      sy * video.height,
      sw * video.width,
      sh * video.height
    )
    /*
    image(
      video,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      -(windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio - padding * ratioInput),
      windowsProp.window1.height * sh * ratio,
      sx * video.width - 1,
      sy * video.height,
      1,
      sh * video.height
    )
    
    image(
      video,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio + windowsProp.window1.width * sw * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio - padding * ratioInput,
      windowsProp.window1.height * sh * ratio,
      sx * video.width + sw * video.width,
      sy * video.height,
      1,
      sh * video.height
    )
    image(
      video,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * sw * ratio,
      -(windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio - padding * ratioInput),
      sx * video.width,
      sy * video.height-1,
      sw * video.width,
      1
    )

    image(
      video,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio + windowsProp.window1.height * sh * ratio,
      windowsProp.window1.width * sw * ratio,
      windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio - padding * ratioInput,
      sx * video.width,
      sy * video.height + sh * video.height,
      sw * video.width,
      1
    )
    */





    let point = [

      [windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * 0.5 * ratio * sw,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * 0.5 * ratio * sh + leftY * windowsProp.window1.height * ratio],
      [windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * 0.5 * ratio * sw + topX * windowsProp.window1.width * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * 0.5 * ratio * sh + topY * windowsProp.window1.height * ratio],
      [windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * 0.5 * ratio * sw + bottomX * windowsProp.window1.width * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * 0.5 * ratio * sh + bottomY * windowsProp.window1.height * ratio],
      [windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * 0.5 * ratio * sw + sw * windowsProp.window1.width * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * 0.5 * ratio * sh + rightY * windowsProp.window1.height * ratio],

    ]



    windowRect(
      windowsProp.window1.posX + padding * ratioInput,
      windowsProp.window1.posY + padding * ratioInput,
      windowsProp.window1.width - padding * 2 * ratioInput,
      windowsProp.window1.height - padding * 2 * ratioInput,
      point,
      ratioInput)

  }
}

function keyPressed() {
  if (key === ';') {

    startRecording();

    tween.forEach(t => t.kill())
    tween[0] = gsap.to(windowsBase, {
      duration: 1,
      ease: "expo.inOut",
      state: 1
    })
    tween[1] = gsap.to(windowsBase, {
      duration: 0.8,
      ease: "expo.out",
      col1: 400,
      padding: 10
    })

    lipsInput = [];
    lipsInput.push(new LipsData(JSON.parse(JSON.stringify(detections)), video));
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
    tween[0] = gsap.to(windowsBase, {
      duration: 3,
      ease: "expo.out",
      state: 0,
      padding: 30
    })
    tween[1] = gsap.to(windowsBase, {
      duration: 1,
      ease: "expo.out",
      col1: 200,

    })




    isRecording = false;
  }

  if (key === 'Backspace') {

    isDeleting = false;

  }
}





function recordDetection() {
  if (isRecording) {
    lipsInput.push(new LipsData(JSON.parse(JSON.stringify(detections)), video));
  }
}

//监测键盘输入字符串
function keyTyped() {
  //转大写字母
  key = key.toUpperCase();
  //判断是否是字母
  if (key >= 'A' && key <= 'Z') {
    TextInput += key;
    console.log(TextInput);
  }
  //判断是否是空格
  if (key === ' ') {
    TextInput += ' ';
    console.log(TextInput);
  }
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


}


function mouseReleased() {

}