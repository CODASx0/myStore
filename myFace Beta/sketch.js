let canvas;
let lips = [];

let smoothingFactor = 0.6; // 平滑因子，取值范围是 0 到 1。值越大，平滑效果越强。
let smoothedDetections = null;
let returnReady = false;


let gridDisplay = true;

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
        this.type = "lips";
    }
    draw(posX, posY, meshSize, width, color, alpha) {

        let xyRatio = 0.75
        let sizeRatio = width / (this.right.x - this.left.x);
        let height = sizeRatio * (this.bottom.y - this.top.y) * xyRatio;
        let leftMargin = (meshSize - width) / 2;
        let topMargin = (meshSize - height) / 2;

        //fill(color, alpha);

        stroke(0);
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


//字符类
class myText {
    constructor(input, isReturn, time) {
        this.type = "text";
        this.text = input;
        this.isReturn = isReturn;
        this.time = time;
    }
    draw(posX, posY, meshSize, width, color, alpha) {
        textFont(font);
        textSize(width);
        textAlign(CENTER, CENTER);
        fill(0);
        text(this.text, posX + meshSize / 2, posY + meshSize / 2 - width / 4.8);
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




//录制函数
function recordDetection() {
    if (isRecording) {
        lipsArray[lipsArray.length - 1][frameCount - lipsArray[lipsArray.length - 1][0].time] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
    }
}

let scrollY = 0;

//网格系统
function showElement() {
    //页边距
    let pageMargin = 40;
    //段间距
    let paragraphSpacing = 30;
    //段内边距
    let padding = 10;
    //行间距
    let lineSpacing = 20;
    //字间距
    let wordSpacing = 20;
0
    //字符占位大小
    let gridSize = 40;

    //计算每行字数
    let columns = Math.floor((canvas.width - pageMargin * 2 - padding * 2) / (gridSize + wordSpacing));
    if (canvas.width - pageMargin * 2 - padding * 2 - columns * (gridSize + wordSpacing) > gridSize) {
        columns++;
    }

    //段落数
    let paragraphNum = 0;
    //统计每段字数
    let paragraphLength = new Array(0);

    //段落全宽行数
    let paragraphFullLineNum = new Array(0);

    //段落非全宽字数
    let paragraphNotFullLine = new Array(0);

    //圆角大小
    let cornerRadius = 10;

    //Y轴滚动值


    //图案缩放系数
    let ratio = 0.9;

    //累计段落字数
    for (let i = 0; i < lipsArray.length; i++) {
        if (paragraphLength[paragraphNum] === undefined) {
            paragraphLength[paragraphNum] = 0;
        }
        paragraphLength[paragraphNum] += 1;


        if (lipsArray[i][0].isReturn || i === lipsArray.length - 1) {

            paragraphFullLineNum[paragraphNum] = Math.floor(paragraphLength[paragraphNum] / columns);
            paragraphNotFullLine[paragraphNum] = paragraphLength[paragraphNum] % columns;
            paragraphNum++;
        }
    }

    for (let i = 0; i < paragraphNum; i++) {
        let paragraphY = pageMargin + scrollY;
        //根据前文段落情况计算当前段落的Y坐标
        for (let j = 0; j < i; j++) {
            //段间距
            paragraphY += paragraphSpacing;
            //段内边距
            paragraphY += padding * 2;
            //行间距(行数大于二时才有行间距)
            paragraphY += lineSpacing * (paragraphFullLineNum[j] - 1);
            //字符高度
            paragraphY += gridSize * paragraphFullLineNum[j];
            //非全宽行高度
            //非全宽行高度
            if (paragraphNotFullLine[j] > 0) {
                console.log(j, paragraphNotFullLine[j]);
                paragraphY += lineSpacing + gridSize;
            }
        }

        //计算段落衬底末端的X坐标
        let paragraphEndX = pageMargin + padding * 2 + (gridSize + wordSpacing) * paragraphNotFullLine[i] - wordSpacing;

        //绘制段落衬底
        if (paragraphFullLineNum[i] === 0) {
            fill(255, 255);
            noStroke();
            rect(pageMargin, paragraphY, paragraphEndX - pageMargin, gridSize + padding * 2, cornerRadius);
        } else if (paragraphNotFullLine[i] === 0) {
            //衬底最大宽度
            let maxWidth = padding * 2 + (gridSize + wordSpacing) * columns - wordSpacing;
            //全宽衬底高度
            let fullHeight = padding * 2 + (gridSize + lineSpacing) * paragraphFullLineNum[i] - lineSpacing;
            fill(255, 255);
            noStroke();
            rect(pageMargin, paragraphY, maxWidth, fullHeight, cornerRadius);

        } else {
            //衬底最大宽度
            let maxWidth = padding * 2 + (gridSize + wordSpacing) * columns - wordSpacing;
            //全宽衬底高度
            let fullHeight = padding * 2 + (gridSize + lineSpacing) * paragraphFullLineNum[i] - lineSpacing;
            fill(255, 255);
            noStroke();
            rect(pageMargin, paragraphY, maxWidth, fullHeight, cornerRadius, cornerRadius, cornerRadius, 0);
            //非全宽衬底
            rect(pageMargin, paragraphY + fullHeight, paragraphEndX - pageMargin, gridSize + lineSpacing, 0, 0, cornerRadius, cornerRadius);

        }
    }

    //累计字数
    let wordNum = 0;
    //分段落绘制图案(代码与上文段落衬底绘制相同)
    for (i = 0; i < paragraphNum; i++) {

        let paragraphY = pageMargin + scrollY;
        //根据前文段落情况计算当前段落的Y坐标
        for (let j = 0; j < i; j++) {
            //段间距
            paragraphY += paragraphSpacing;
            //段内边距
            paragraphY += padding * 2;
            //行间距(行数大于二时才有行间距)
            paragraphY += lineSpacing * (paragraphFullLineNum[j] - 1);
            //字符高度
            paragraphY += gridSize * paragraphFullLineNum[j];
            //非全宽行高度
            //非全宽行高度
            if (paragraphNotFullLine[j] > 0) {
                console.log(j, paragraphNotFullLine[j]);
                paragraphY += lineSpacing + gridSize;
            }
        }

        for (j = 0; j < paragraphLength[i]; j++) {

            //计算当前字在段落中的坐标
            let posX = pageMargin + padding + (gridSize + wordSpacing) * (j % columns);
            let posY = paragraphY + padding + (gridSize + lineSpacing) * Math.floor(j / columns);
            //绘制当前字
            stroke(0, 20);
            if (gridDisplay) {
                //定位辅助线
                noFill();
                line(posX, posY, posX + gridSize, posY + gridSize);
                line(posX + gridSize, posY, posX, posY + gridSize);
                rect(posX, posY, gridSize, gridSize)
            }
            //判断是否在录制中
            if (wordNum === lipsArray.length - 1 && isRecording) {
                fill(255, 0, 0, 255);
                noStroke();
            } else {
                fill(255, 255);
                noStroke();
            }

            let timeLine = (frameCount - lipsArray[wordNum][0].time) % lipsArray[wordNum].length;
            lipsArray[wordNum][timeLine].draw(posX, posY, gridSize, gridSize * ratio);
            wordNum++;
        }

    }
}



//画布适应窗口大小
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//p5.js


let font;

function preload() {
    font = loadFont('assets/SourceSerif4-VariableFont_opsz,wght.ttf');
}

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id("canvas");
    //frameRate(60);
}

function draw() {
    clear();
    //circle(mouseX, mouseY, 20);


    if (detections != undefined) {
        updateDetections(detections);
        /*
        lips[0] = new myLips(smoothedDetections, false, frameCount);
        fill(255, 255);
        noStroke();
        lips[0].draw(canvas.width / 2 - 200, canvas.height / 2 - 200, 400, 320);
        */
    }


    //触控检测
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

    fill(255, 255);
    noStroke();
    showElement();

    if (lipsArray.length > 0) {
        //console.log(lipsArray.length, lipsArray[lipsArray.length - 1].length, lipsArray[lipsArray.length - 1][0].isReturn);
    }

    if (isRecording) {
        fill(255, 0, 0);
    } else {
        fill(255, 255, 255);
    }

    noStroke();
    ellipse(16, height - 16, 12, 12);
}


function keyPressed() {
    if ((key === ' ') && detections != undefined) {
        //按下空格键键开始录制
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myLips(JSON.parse(JSON.stringify(smoothedDetections)), returnReady, frameCount);
        isRecording = true;
    }
    if (key === 'Backspace') {
        lipsArray.pop();
    }
    //全键盘的字符映射
    if (key === ',') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText(',', returnReady, frameCount);
    }
    if (key === '.') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('.', returnReady, frameCount);
    }
    if (key === '<') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('<', returnReady, frameCount);
    }
    if (key === '>') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('>', returnReady, frameCount);
    }
    if (key === '!') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('!', returnReady, frameCount);
    }
    if (key === '@') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('@', returnReady, frameCount);
    }
    if (key === '#') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('#', returnReady, frameCount);
    }
    if (key === '$') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('¥', returnReady, frameCount);
    }
    if (key === '%') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('%', returnReady, frameCount);
    }
    if (key === '^') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('…', returnReady, frameCount);
    }
    if (key === '&') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('&', returnReady, frameCount);
    }
    if (key === '*') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('*', returnReady, frameCount);
    }
    if (key === '(') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('(', returnReady, frameCount);
    }
    if (key === ')') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText(')', returnReady, frameCount);
    }
    if (key === '-') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('-', returnReady, frameCount);
    }
    if (key === '_') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('_', returnReady, frameCount);
    }
    if (key === '=') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('=', returnReady, frameCount);
    }
    if (key === '+') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('+', returnReady, frameCount);
    }
    if (key === '[') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('[', returnReady, frameCount);
    }
    if (key === ']') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText(']', returnReady, frameCount);
    }
    if (key === '{') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('{', returnReady, frameCount);
    }
    if (key === '}') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('}', returnReady, frameCount);
    }
    if (key === ';') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText(';', returnReady, frameCount);
    }
    if (key === ':') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText(':', returnReady, frameCount);
    }
    if (key === '\'') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('\'', returnReady, frameCount);
    }
    if (key === '"') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('"', returnReady, frameCount);
    }
    if (key === '`') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('`', returnReady, frameCount);
    }
    if (key === '~') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('~', returnReady, frameCount);
    }
    if (key === '\\') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('\\', returnReady, frameCount);
    }
    if (key === '|') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('|', returnReady, frameCount);
    }
    if (key === '/') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('/', returnReady, frameCount);
    }
    if (key === '?') {
        lipsArray[lipsArray.length] = new Array(timeSetup);
        lipsArray[lipsArray.length - 1][0] = new myText('?', returnReady, frameCount);
    }

}


function keyReleased() {
    if (key === ' ') {
        isRecording = false;
        returnReady = false;
    }

    if (keyCode === RETURN) {
        //按下回车键准备换行
        //returnReady = true;
        lipsArray[lipsArray.length - 1][0].isReturn = true;
    }

}