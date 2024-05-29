




let videoIn;
let videoDetection;

//需要实时更新的数据
let tempInput;


let canvas;
let videoElement = document.getElementById('webcam')


let font;

let tween = [];


//文本输入
let textInput = '';

//嘴部输入
let lipsInput = [];
let isRecording = false;

//删除检测
let isDeleting = false;
let deleteTime = 0;


//窗口基准值（旧版）
let windowsBase = {
  padding: 30,
  col1: 200,
  state: 0
}



//旧版（暂未弃用）
let windowsProp

//GUI置入bianliang--------------------------------



//--------------------------------


function preload() {
  icon = {
    arrow: loadImage('assets/icon/arrow.png'),
  }
  soundFormats('wav');
  sound = {
    start: loadSound('assets/sound/Cm.wav'),
    end: loadSound('assets/sound/C.wav'),
    sucess: loadSound('assets/sound/Cm2.wav'),
    error: loadSound('assets/sound/Em.wav'),

    enter: loadSound('assets/sound/natural-tap-2.wav'),
    leave: loadSound('assets/sound/natural-tap-1.wav'),
  }
}






function setup() {

  startP5jsWebcam()
  if (pixelDensityControl != 0) {
    pixelDensity(pixelDensityControl)
  }
  

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("canvas");
  font = loadFont('assets/OPlusSans3-Light.ttf');
  noSmooth()

  textFont(font);




  frameRate(60)

  smoothX = mouseX;
  smoothY = mouseY;

}

function draw() {




  globalUpdate()

  windowsUpdate()

  clear()

  //控制方式还要修改
  //control()
  //newControl(0, wProp.w1.height + wProp.w2.height, windowWidth, windowHeight - wProp.w1.height - wProp.w2.height)
  newControl(newWP.w1.posX, newWP.w1.posY, newWP.w1.width, newWP.w1.height)
  fill(0, 20)
  //rect(0, wProp.w1.height, windowWidth, wProp.w2.height)



  //windowRectBasic(windowsProp.window2.posX, windowsProp.window2.posY, windowsProp.window2.width, windowsProp.window2.height, 6 + 40 * windowsBase.state)

  //预览方式还要改
  //ImagePreview(windowsBase.state)

  //嘴唇预览还要改
  LipsPreview(lipsInput)

  //console.log(videoIn.height / videoIn.width)



  waitingTest()

}






function waitingTest() {

  if (lastIsWaiting != isWaiting) {
    if (textInput == '') {
      sound.error.play()
    } else {
      sound.sucess.play()
    }
  }

  if (isWaiting) {
    if (frameCount % 45 == 0) {
      //生成省略号
      textInput += '.'
    }
  }
  lastIsWaiting = isWaiting
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
    },

  }

  wProp.w1.width = windowWidth


  gsap.to(wProp.w1, {
    duration: 2,
    //height: wProp.w1.heightReady,


  })

  gsap.to(wProp.w2, {
    duration: 0.5,
    //height:windowHeight,


  })


}



function LipsPreview(lipsInput) {
  let step = imageStep
 
  let targetHeight = 100;

  let posX = 10
  let posX0 = 0
  let unit = 0

  //暂时修改 let posY = windowsProp.window2.posY + windowsBase.state * 40
  let posY = 20 + wProp.w1.height + wProp.w2.height
  //posY = 10


  let posY0 = 0
  let widthMin
  let ratio = 0.1
  let height = 0
  let width = 0

  let padding = 20


  fill(255)
  noStroke()
  //rect(wProp.w1.posX, wProp.w1.posY, wProp.w1.width, wProp.w1.height)


  //先遍历一遍找到最小的宽度，以及最上的坐标并进行修正，以及总体的宽度----非常重要----
  if (lipsInput != undefined && lipsInput.length > 0) {
    widthMin = lipsInput[0].img.width


    for (let i = 0; i < lipsInput.length; i += 1) {
      if (lipsInput[i].img.width < widthMin) {
        widthMin = lipsInput[i].img.width
      }
      if (lipsInput[i].centerY - lipsInput[0].centerY < 0) {
        posY0 = Math.max(-(lipsInput[i].centerY - lipsInput[0].centerY), posY0)
      }

    }

    for (let i = 0; i < lipsInput.length; i += 1) {
      lipsInput[i].posX0 = width
      lipsInput[i].posY0 = posY0 + lipsInput[i].centerY - lipsInput[0].centerY,

      height = Math.max(posY0 + lipsInput[i].centerY - lipsInput[0].centerY + lipsInput[i].img.height, height)
      unit = 3 * step + (lipsInput[i].img.width - widthMin) * ratio
      lipsInput[i].width0 = unit
      width += unit
    }

    for (let i = 0; i < lipsInput.length; i ++) {
      lipsInput[i].height0 = height
    }
  }



  if (false) {
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

  //rect(posX, posY, width + padding * 2 , height + padding * 2,8,0,8,0)

  posX += padding
  posY += padding

  for (let i = 0; i < lipsInput.length; i += step) {
    unit = lipsInput[i].width0

    let unit0 = unit +1

    
    image(lipsInput[i].img,

      //旧版：posX + lipsInput[i].posX0 - lipsInput[i].scaleX * unit0 * 0.5,
      //新版：
      posX + lipsInput[i].posX0,

      posY + (lipsInput[i].posY0 + lipsInput[i].img.height * 0.5 * (1 - lipsInput[i].scaleY))/height*targetHeight,
      unit0 * lipsInput[i].scaleX*imageStep,
      lipsInput[i].img.height * lipsInput[i].scaleY / height * targetHeight,


      lipsInput[i].img.width / 2 - unit0 * 0.5 * lipsInput[i].scaleX,
      0,
      unit * lipsInput[i].scaleX*imageStep,
      lipsInput[i].img.height
    )
    
    

    /*
    mask2(
      posX + lipsInput[i].posX0,

      posY + lipsInput[i].posY0 + lipsInput[i].img.height * 0.5 * (1 - lipsInput[i].scaleY),
      unit0 * lipsInput[i].scaleX*imageStep,
      lipsInput[i].img.height * lipsInput[i].scaleY,
      [lipsInput[i].inTopY, lipsInput[i].inBottomY],
    )
    */

  }


  posY += padding + height



  /*
  drawMeshTypeAdvanceV3(posX, posY + 5, lipsInput, textInput, 0, 1)
  drawMeshTypeAdvanceV31(posX, posY + 5, lipsInput, textInput, 0)

  posY += padding + height + padding
  posX -= padding

  */

  fill(0)
  textSize(12)
  //text('Output: ' + textInput, posX, posY)

  wProp.w1.heightReady = posY + padding


}


function ImagePreview(ratioInput) {
  let padding = 40;


  windowRectBasic(windowsProp.window1.posX, windowsProp.window1.posY, windowsProp.window1.width, windowsProp.window1.height, 6 + padding * ratioInput)
  windowRectBasicV2(windowsProp.window1.posX + padding * ratioInput,
    windowsProp.window1.posY + padding * ratioInput,
    windowsProp.window1.width - padding * 2 * ratioInput,
    windowsProp.window1.height - padding * 2 * ratioInput, 6)

  let ratio = (ratioInput + 2);
  if (videoIn && detections && tempInput) {
    //image(videoIn,0,0,300,300)


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
      videoIn,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * sw * ratio,
      windowsProp.window1.height * sh * ratio,
      sx * videoIn.width,
      sy * videoIn.height,
      sw * videoIn.width,
      sh * videoIn.height
    )
    /*
    image(
      videoIn,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      -(windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio - padding * ratioInput),
      windowsProp.window1.height * sh * ratio,
      sx * videoIn.width - 1,
      sy * videoIn.height,
      1,
      sh * videoIn.height
    )
    
    image(
      videoIn,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio + windowsProp.window1.width * sw * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio - padding * ratioInput,
      windowsProp.window1.height * sh * ratio,
      sx * videoIn.width + sw * videoIn.width,
      sy * videoIn.height,
      1,
      sh * videoIn.height
    )
    image(
      videoIn,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio,
      windowsProp.window1.width * sw * ratio,
      -(windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio - padding * ratioInput),
      sx * videoIn.width,
      sy * videoIn.height-1,
      sw * videoIn.width,
      1
    )

    image(
      videoIn,
      windowsProp.window1.posX + windowsProp.window1.width * 0.5 - windowsProp.window1.width * sw * 0.5 * ratio,
      windowsProp.window1.posY + windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio + windowsProp.window1.height * sh * ratio,
      windowsProp.window1.width * sw * ratio,
      windowsProp.window1.height * 0.5 - windowsProp.window1.height * sh * 0.5 * ratio - padding * ratioInput,
      sx * videoIn.width,
      sy * videoIn.height + sh * videoIn.height,
      sw * videoIn.width,
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






function recordDetection() {
  if (isRecording) {
    lipsInput.push(new LipsData(JSON.parse(JSON.stringify(detections)), videoIn));
    gsap.to(lipsInput[lipsInput.length - 1], {
      duration: 2.5,
      scaleY: 1,

      ease: "elastic.out(1,0.3)",
    })
    gsap.to(lipsInput[lipsInput.length - 1], {
      scaleX: 1,
      duration: 1,
      ease: "power1.out",
    })
  }
}


//调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


