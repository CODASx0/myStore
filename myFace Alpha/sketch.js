let canvas;
let lips = [];

let smoothingFactor = 0.6; // 平滑因子，取值范围是 0 到 1。值越大，平滑效果越强。
let smoothedDetections = null;
let returnReady = false;
function updateDetections(newDetections) {
    if (smoothedDetections == null) {
        // 如果 smoothedDetections 还没有初始化，就直接使用 newDetections
        smoothedDetections = newDetections;
    } else {
        // 否则，使用滑动平均来更新 smoothedDetections
        for (let i = 0; i < newDetections.length; i++) {
            smoothedDetections[i].x = smoothingFactor * smoothedDetections[i].x + (1 - smoothingFactor) * newDetections[i].x;
            smoothedDetections[i].y = smoothingFactor * smoothedDetections[i].y + (1 - smoothingFactor) * newDetections[i].y;
            smoothedDetections[i].z = smoothingFactor * smoothedDetections[i].z + (1 - smoothingFactor) * newDetections[i].z;
        }
    }
}

//嘴唇类
class myLips {
    constructor(input, isReturn, time) {
        this.upperLip = [input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[308], input[415], input[310], input[311], input[312], input[13], input[82], input[80], input[191], input[78], input[61]];
        this.lowerLip = [input[78], input[95], input[88], input[178], input[87], input[14], input[317], input[402], input[318], input[324], input[308], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61], input[78]];
        this.outLip = [input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61]];
        this.inLip = [input[78], input[191], input[80], input[82], input[13], input[312], input[311], input[310], input[415], input[308], input[324], input[402], input[317], input[14], input[87], input[178], input[88], input[95], input[78]];

        this.left = input[61];
        this.right = input[291];
        this.top = input[0];
        this.bottom = input[17];

        this.isReturn = isReturn;
        this.time = time;
    }
    draw(posX, posY, meshSize, width,color,alpha) {
        let xyRatio = 0.75
        let sizeRatio = width / (this.right.x - this.left.x);
        let height = sizeRatio * (this.bottom.y - this.top.y) * xyRatio;
        let leftMargin = (meshSize - width) / 2;
        let topMargin = (meshSize - height) / 2;



        beginShape();
        for (let i = 0; i < this.upperLip.length - 1; i++) {
            let inputX = this.upperLip[i].x;
            let inputY = this.upperLip[i].y;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            curveVertex(outputX, outputY);
        }
        endShape(CLOSE);

        beginShape();
        for (let i = 0; i < this.lowerLip.length - 1; i++) {
            let inputX = this.lowerLip[i].x;
            let inputY = this.lowerLip[i].y;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            curveVertex(outputX, outputY);
        }
        endShape(CLOSE);

    }
}
//一个判断是否在录制中的布尔值
let isRecording = false;

//定义二维数组，一个维度为嘴唇所代表的不同的字，另一个维度为嘴唇在不同时间的状态
let timeSetup = 1;
let lipsNum = 0;
let lipsArray = new Array(lipsNum);
for (let i = 0; i < lipsNum; i++) {
    lipsArray[i] = new Array(timeSetup);
}

//按下i键开始录制，松开i键结束录制
function keyPressed() {
    if ((key === 'i' || key === 'I') && detections != undefined) {

        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
        isRecording = true;

    }
}

//按下退格键删除最后一个字，按下回车键准备换行
function keyReleased() {
    if (key === 'i' || key === 'I') {
        isRecording = false;
        returnReady = false;
    }
    if (key === 'Backspace') {
        lipsArray.pop();
    }
    if (keyCode === RETURN) {
        returnReady = true;
    }
}

//录制函数
function recordDetection() {
    if (isRecording) {
        lipsArray[lipsArray.length - 1][frameCount - lipsArray[lipsArray.length - 1][0].time] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
    }
}

//网格系统
function showLips() {
    let gridSize = 120;
    let columns = canvas.width / gridSize;
    let gridX = 0;
    let gridY = 0;
    let i = 0;

    while (i < lipsArray.length) {
        if (i === lipsArray.length - 1 && isRecording) {
            
            fill(255,0,0, 255);
            noStroke();
        } else {
            fill(220, 255);
            noStroke();
        }
        if (lipsArray[i][0].isReturn) {
            gridX = 0;
            gridY++;
        }

        let timeLine = (frameCount - lipsArray[i][0].time) % lipsArray[i].length;

        lipsArray[i][timeLine].draw(gridX * gridSize, gridY * gridSize, gridSize, gridSize * 0.6);

        if (gridX < columns - 2) {
            gridX++;
        } else {
            gridX = 0;
            gridY++;
        }
        i++;
    }
}



//画布适应窗口大小
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//p5.js
function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id("canvas");
    frameRate(60);
}

function draw() {
    clear();
    //circle(mouseX, mouseY, 20);

    if (detections != undefined) {
        updateDetections(detections);
        lips[0] = new myLips(smoothedDetections, false, frameCount);
        fill(255, 255);
        noStroke();
        lips[0].draw(canvas.width / 2 - 200, canvas.height / 2 - 200, 400, 320);
    }

    canvas.touchStarted(fxn = () => {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
        isRecording = true;
    });

    canvas.touchEnded(fxn = () => {
        isRecording = false;
        returnReady = false;
    });


    recordDetection();

    fill(220, 255);
    noStroke();
    showLips();

    if (lipsArray.length > 0) {
        //console.log(lipsArray.length, lipsArray[lipsArray.length - 1].length, lipsArray[lipsArray.length - 1][0].isReturn);
        console.log(lipsArray[0][0].left);
    }

    if (isRecording) {
        fill(255, 0, 0);
    } else {
        fill(255, 255, 255);
    }
    noStroke();
    ellipse(16, height - 16, 12, 12);
}
