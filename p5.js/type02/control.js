

let controlInput = [0, 0, 0, 0, 0, 0, 0, 0]
let cameraIndex = 0;
let cameraWidth = 1920;
let cameraHeight = cameraWidth * 0.75;




let controlInputList = [];
let outOfTime = 4;
let isOutOfTime = false;

let distanceTest = false;

let lerpRatio = 0.4;

let controlState = false;
let lastControlState = false;

let controlDelayStart = 0;
let leastDelay = 20;
let isDelay = false;

function control() {
    if (handDetections != undefined && detections != undefined) {

        lastControlState = controlState;

        //食指
        controlInput[0] = lerp(controlInput[0], handDetections[8].x, lerpRatio);
        controlInput[1] = lerp(controlInput[1], handDetections[8].y, lerpRatio);
        //右嘴角
        controlInput[2] = lerp(controlInput[2], detections[57].x, lerpRatio);
        controlInput[3] = lerp(controlInput[3], detections[57].y, lerpRatio);
        //中指
        controlInput[4] = lerp(controlInput[4], handDetections[12].x, lerpRatio);
        controlInput[5] = lerp(controlInput[5], handDetections[12].y, lerpRatio);
        //左嘴角
        controlInput[6] = lerp(controlInput[6], detections[287].x, lerpRatio);
        controlInput[7] = lerp(controlInput[7], detections[287].y, lerpRatio);



        let distance = dist(controlInput[0], controlInput[1], controlInput[2], controlInput[3]) * 1000;
        let distance2 = dist(controlInput[4], controlInput[5], controlInput[6], controlInput[7]) * 1000;

        if (distance < 20) { distanceTest = true }
        //因为即使没有检测到手的坐标，也会有一个默认的坐标，所以这里需要判断一下是否超时

        if (controlInputList.length < outOfTime) {
            controlInputList.push([handDetections[8].x, handDetections[8].y]);
        } else {
            controlInputList.shift();
            controlInputList.push([handDetections[8].x, handDetections[8].y]);
        }

        for (let i = 0; i < controlInputList.length - 1; i++) {
            isOutOfTime = true;
            //如果列表里面的坐标都是一样的，那么就说明超时了
            if (controlInputList[i][0] != controlInputList[i + 1][0] && controlInputList[i][1] != controlInputList[i + 1][1]) {
                isOutOfTime = false;
                break;
            }
        }

        if (distanceTest && !isOutOfTime) {

            controlState = true;


        } else {
            controlState = false;
        }

        //当controlState变成true时的一瞬间，开始录制
        if (controlState && !lastControlState && !isWaiting) {
            controlDelayStart = frameCount;
            globalStart();
        }

        //当controlState变成false时的一瞬间，结束录制
        if (!controlState && lastControlState && !isWaiting) {
            if (frameCount - controlDelayStart > leastDelay) {
                globalEnd();
            } else {
                isDelay = true;
            }

        }
        if (isDelay && frameCount - controlDelayStart > leastDelay) {
            isDelay = false;
            globalEnd();
        }


    }
}

const indicatorStyle = {
    notActive: {
        radius: 100,
        fill: 'rgba(255, 255, 255, 0)',
        stroke: 'rgba(255, 255, 255, 0)',
        strokeWeight: 0
    },

    lipNotActive: {
        radius: 200,
        fill: 'rgba(255, 255, 255, 0)',
        stroke: 'rgba(255, 255, 255, 0)',
        strokeWeight: 0
    },

    active: {
        radius: 40,
        fill: 'rgba(255, 255, 255, 0.1)',
        stroke: 'rgba(255, 255, 255, 0.7)',
        strokeWeight: 10
    },

    lipActive: {
        radius: 30,
        fill: 'rgba(255, 255, 255, 0.6)',
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeWeight: 20
    },

    ready: {
        radius: 20,
        fill: 'rgba(255, 255, 0, 1)',
        stroke: 'rgba(255, 255, 255, 0)',
        strokeWeight: 0
    },

    lipReady: {
        radius: 30,
        fill: 'rgba(255, 255, 255, 0.4)',
        stroke: 'rgba(255, 255, 255, 1)',
        strokeWeight: 10
    },

    recording: {
        radius: 20,
        fill: 'rgba(0, 255, 0, 0.8)',
        stroke: 'rgba(255, 255, 255, 1)',
        strokeWeight: 4
    },

    lipRecording: {
        radius: 40,
        fill: 'rgba(255, 255, 255, 0.4)',
        stroke: 'rgba(255, 255, 255, 0)',
        strokeWeight: 0
    },


    waiting: {
        radius: 30,
        fill: 'rgba(255, 0,0, 0.6)',
        stroke: 'rgba(255, 255, 255, 1)',
        strokeWeight: 10
    },

    lipWaiting: {
        radius: 50,
        fill: 'rgba(255, 100, 100, 0.2)',
        stroke: 'rgba(255, 0, 0, 0)',
        strokeWeight: 0
    }

}

function indicatorUpdater() {

    //录制启停检测
    let distance = dist(handIndicator.x, handIndicator.y, lipIndicator.x, lipIndicator.y);
    //当两个点之间的位置小于40

    if (handIndicator.active && lipIndicator.active) {
        if (isWaiting) {
            handIndicator.state = 'waiting'
            lipIndicator.state = 'waiting'
        }
        else if (distance < 40) {
            handIndicator.state = 'recording'
            lipIndicator.state = 'recording'

        }
        else if (distance < 100 && isRecording) {
            handIndicator.state = 'steady'
            lipIndicator.state = 'steady'
        }
        else if (distance < 120) {
            handIndicator.state = 'ready'
            lipIndicator.state = 'ready'
        }
        else {
            handIndicator.state = 'active'
            lipIndicator.state = 'active'
        }
    }
    else if (lipIndicator.active) {
        if (isWaiting) {
            lipIndicator.state = 'waiting'
        } else {
            lipIndicator.state = 'active'
        }
        handIndicator.state = 'notActive'

    }

    else {
        lipIndicator.state = 'notActive'
        handIndicator.state = 'notActive'
    }






    //激活状态切换
    if (handIndicator.state != handIndicator.lastState) {

        if (handIndicator.state == 'recording' && handIndicator.lastState == 'ready') {
            globalStart();
        } else if (handIndicator.state != 'recording' && handIndicator.state != 'steady') {
            globalEnd();
        }


        if (handIndicator.state == 'active') {
            tl.clear()

            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.active.strokeWeight,
                radius: indicatorStyle.active.radius,
                stroke: indicatorStyle.active.stroke,
                fill: indicatorStyle.active.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
        if (handIndicator.state == 'notActive') {
            tl.clear()
            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.notActive.strokeWeight,
                radius: indicatorStyle.notActive.radius,
                stroke: indicatorStyle.notActive.stroke,
                fill: indicatorStyle.notActive.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
        if (handIndicator.state == 'ready') {
            tl.clear()
            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.ready.strokeWeight,
                radius: indicatorStyle.ready.radius,
                stroke: indicatorStyle.ready.stroke,
                fill: indicatorStyle.ready.fill,
                postionRatio: 0.5,
                ease: "expo.out"
            })

        }
        if (handIndicator.state == 'recording') {
            tl.clear()
            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.recording.strokeWeight,
                radius: indicatorStyle.recording.radius,
                stroke: indicatorStyle.recording.stroke,
                fill: indicatorStyle.recording.fill,
                postionRatio: 0,
                ease: "expo.out"
            })

        }

        if (handIndicator.state == 'steady') {
            tl.clear()
            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.recording.strokeWeight,
                radius: indicatorStyle.recording.radius,
                stroke: indicatorStyle.recording.stroke,
                fill: indicatorStyle.recording.fill,
                postionRatio: 0.5,
                ease: "expo.out"
            })

        }

        if (handIndicator.state == 'waiting') {
            tl.clear()
            tl.to(handIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.waiting.strokeWeight,
                radius: indicatorStyle.waiting.radius,
                stroke: indicatorStyle.waiting.stroke,
                fill: indicatorStyle.waiting.fill,
                postionRatio: 0.1,
                ease: "expo.out"
            })

        }
    }

    if (lipIndicator.state != lipIndicator.lastState) {


        if (lipIndicator.state == 'active') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipActive.strokeWeight,
                radius: indicatorStyle.lipActive.radius,
                stroke: indicatorStyle.lipActive.stroke,
                fill: indicatorStyle.lipActive.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
        if (lipIndicator.state == 'notActive') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipNotActive.strokeWeight,
                radius: indicatorStyle.lipNotActive.radius,
                stroke: indicatorStyle.lipNotActive.stroke,
                fill: indicatorStyle.lipNotActive.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
        if (lipIndicator.state == 'ready') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipReady.strokeWeight,
                radius: indicatorStyle.lipReady.radius,
                stroke: indicatorStyle.lipReady.stroke,
                fill: indicatorStyle.lipReady.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
        if (lipIndicator.state == 'recording') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipRecording.strokeWeight,
                radius: indicatorStyle.lipRecording.radius,
                stroke: indicatorStyle.lipRecording.stroke,
                fill: indicatorStyle.lipRecording.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }

        if (lipIndicator.state == 'steady') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipRecording.strokeWeight,
                radius: indicatorStyle.lipRecording.radius,
                stroke: indicatorStyle.lipRecording.stroke,
                fill: indicatorStyle.lipRecording.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }

        if (lipIndicator.state == 'waiting') {
            lipTl.clear()
            lipTl.to(lipIndicator, {
                duration: 0.5,
                strokeWeight: indicatorStyle.lipWaiting.strokeWeight,
                radius: indicatorStyle.lipWaiting.radius,
                stroke: indicatorStyle.lipWaiting.stroke,
                fill: indicatorStyle.lipWaiting.fill,
                postionRatio: 1,
                ease: "expo.out"
            })
        }
    }

}

class indicator {
    constructor() {
        this.x = 0
        this.y = 0

        this.x2 = 0
        this.y2 = 0

        this.postionRatio = 1

        this.xNow = this.x * this.postionRatio + this.x2 * (1 - this.postionRatio)
        this.yNow = this.y * this.postionRatio + this.y2 * (1 - this.postionRatio)


        this.radius = 40
        this.fill = 'rgba(255, 255, 255, 0.1)'
        this.stroke = 'rgba(255, 255, 255, 0.1)'
        this.strokeWeight = 2



        this.state = 'notActive'


        this.active = false


        //判断输入是否超时
        this.timeoutThreshold = 5

        this.inputList = []


    }



    Update() {
        this.lastState = this.state

        this.lastActive = this.active


        this.xNow = this.x * this.postionRatio + this.x2 * (1 - this.postionRatio)
        this.yNow = this.y * this.postionRatio + this.y2 * (1 - this.postionRatio)
    }

    activeTest(Detection, windowRatio, videoRatio) {

        this.Update()

        let snapshot = { x: Detection.x, y: Detection.y };  // 创建一个新的对象，只包含x和y属性

        if (this.inputList.length < this.timeoutThreshold) {
            this.inputList.push(snapshot);
        } else {
            this.inputList.shift();
            this.inputList.push(snapshot);
        }

        this.active = false;
        for (let i = 0; i < this.inputList.length - 1; i++) {

            //如果列表里面的数值有一个不一样，说明没超时
            if (this.inputList[i].x != this.inputList[i + 1].x && this.inputList[i].y != this.inputList[i + 1].y) {
                this.active = true;
                break;
            }
            //console.log(this.inputList[i].x)
        }

        if (windowRatio >= videoRatio) {
            let x = 1 / videoRatio * (1 - snapshot.x);
            if (x < (1 / videoRatio - 1 / windowRatio) / 2 || x > 1 / videoRatio / 2 + 1 / windowRatio / 2) {
                this.active = false;
            }
        } else {
            let y = videoRatio * snapshot.y;
            if (y < (videoRatio - windowRatio) / 2 || y > videoRatio / 2 + windowRatio / 2) {
                this.active = false;
            }
        }

    }

    display() {
        fill(color(this.fill))
        stroke(color(this.stroke))
        strokeWeight(this.strokeWeight)
        ellipse(this.xNow, this.yNow, this.radius, this.radius)
    }

}



let lipIndicator = new indicator();
let handIndicator = new indicator();

let tl = gsap.timeline();
let lipTl = gsap.timeline();



function newControl(posX, posY, windowWidth, windowHeight) {


    if (videoIn && tempInput) {


        const windowRatio = windowHeight / windowWidth;
        const videoRatio = cameraHeight / cameraWidth;

        let imageWidth;
        let imageHeight;

        //控制视窗预览
        push()
        if (windowRatio >= videoRatio) {
            imageWidth = windowHeight / videoRatio;
            imageHeight = windowHeight;
        } else {
            imageWidth = windowWidth;
            imageHeight = windowWidth * videoRatio;
        }
        translate(
            posX + windowWidth + (imageWidth - windowWidth) / 2,
            posY - (imageHeight - windowHeight) / 2
        )
        scale(-1, 1)
        image(videoIn, 0, 0, imageWidth, imageHeight);
        pop()

        //控制点预览
        push()
        translate(
            posX - (imageWidth - windowWidth) / 2,
            posY - (imageHeight - windowHeight) / 2
        )

        if (tempFaceDetection != undefined) {
            //右嘴角
            lipIndicator.x = lerp(lipIndicator.x, (1 - tempFaceDetection[61].x) * imageWidth, lerpRatio);
            lipIndicator.y = lerp(lipIndicator.y, tempFaceDetection[61].y * imageHeight, lerpRatio);

            handIndicator.x2 = lipIndicator.x;
            handIndicator.y2 = lipIndicator.y;

            lipIndicator.activeTest(tempFaceDetection[61], windowRatio, videoRatio);

            lipIndicator.display();


        }

        if (tempHandDetection != undefined) {
            //食指
            handIndicator.x = lerp(handIndicator.x, (1 - tempHandDetection[8].x) * imageWidth, lerpRatio);
            handIndicator.y = lerp(handIndicator.y, tempHandDetection[8].y * imageHeight, lerpRatio);

            lipIndicator.x2 = handIndicator.x;
            lipIndicator.y2 = handIndicator.y;

            handIndicator.activeTest(tempHandDetection[8], windowRatio, videoRatio);

            handIndicator.display();


        }

        pop()




        //激活状态切换
        indicatorUpdater()

    }
}

function globalStart() {
    startRecording();
    TextInput = '';

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

    isRecording = true;

}

function globalEnd() {
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


function keyPressed() {
    if (key === ';' && !isWaiting) {

        globalStart();

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
        globalEnd();
    }

    if (key === 'Backspace') {

        isDeleting = false;

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