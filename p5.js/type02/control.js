
let controlInput = [0, 0, 0, 0, 0, 0, 0, 0]

let error = ''

let controlInputList = [];
let outOfTime = 4;
let isOutOfTime = false;

let distanceTest = false;

let lerpRatio = 0.3;

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