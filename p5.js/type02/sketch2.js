//新版窗口属性
let wProp = {
    w1: {
        posX: 0,
        posY: 0,
        width: 1000,
        height: 0,
        heightReady: 20,
    },
    w2: {
        height: 500,
    }
}


var lerpRatio2 = 0.2
var lerpRatio2Min = 0.01
var lerpRatio2Max = 0.5
var lerpRatio2Step = 0.01

var dotSize = 16
var dotSizeMin = 8
var dotSizeMax = 40
var dotSizeStep = 0.5

var gridSize = 10
var gridSizeMin = 4
var gridSizeMax = 40
var gridSizeStep = 0.5

var moveSpace = 3
var moveSpaceMin = 0;
var moveSpaceMax = 30;
var moveSpaceStep = 0.1

var moveControl = 0.4;
var moveControlMin = 0;
var moveControlMax = 2;
var moveControlStep = 0.01

var ratioControl = 1;
var ratioControlMin = 0;
var ratioControlMax = 1;
var ratioControlStep = 0.01;



let testText = 'HELLO'

class dot {
    constructor(x, y, p) {
        this.p = p;


        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;


        this.size = 16
        this.fill = 'rgba(0, 0, 0, 1)'



        this.originX = x;
        this.originY = y;
        this.targetX = x;
        this.targetY = y;

        this.state = 0;

    }

    updateAndDisplay() {


        this.xInput = this.originX * (1 - this.state) + this.targetX * this.state;
        this.yInput = this.originY * (1 - this.state) + this.targetY * this.state;

        this.x = this.p.lerp(this.x, this.xInput, lerpRatio2);
        this.y = this.p.lerp(this.y, this.yInput, lerpRatio2);


        this.p.push()

        //间隔移动距离
        this.distance = this.p.dist(this.x, this.y, this.lastX, this.lastY);

        if (this.distance != 0) {
            this.rotation = this.p.atan2(this.y - this.lastY, this.x - this.lastX);
        }
        this.p.translate(this.x, this.y);
        this.p.rotate(this.rotation);
        this.p.fill(this.p.color(this.fill));
        this.p.ellipse(0, 0, this.size + this.distance * 1, this.size);

        this.p.pop()




        //更新上一次的位置
        this.lastX = this.x;
        this.lastY = this.y;

    }

}

let sketch2 = function (p) {

    let myDot = new dot(0, 0, p);
    //创建一个数量500的myDots数组并存放dot对象
    let myDots = Array.from({ length: 10000 }, () => new dot(p.random(0, p.windowWidth), p.random(0, p.windowHeight), p));


    //定义显示网格点阵字体的函数

    function Show(words) {
        //定义网格间距
        let padding = 40

        let gridSizeHere = gridSize

        let moveSpaceHere = moveSpace
        //let posX = 40;
        let posX = padding;
        //let posY = wProp.w1.height + (wProp.w2.height - gridSizeHere * 7) / 2;
        let posY = padding;


        let blank = 2;
        let lineSpace = 20;

        let wordsNum = 0
        let lastWordsNum = 0



        let letterArray = words.split('');
        //累加每个字符的最大宽度
        let totalWidth = 0;
        let cumulateWidth = 0;

        //校准换行的位置
        let lineFeed = []

        if (letterArray.length > 0) {
            for (let i = 0; i < letterArray.length; i++) {

                if (letterArray[i] == ' ') {
                    wordsNum++
                    cumulateWidth = totalWidth
                }

                const word = dict[letterArray[i]];
                //最右边界
                let rightest = 0;

                for (j = 0; j < word.length; j++) {
                    let x1;
                    //判断是否是多重数组
                    if (word[j][0][0] != undefined) {
                        x1 = word[j][1][0];
                    } else {
                        x1 = word[j][0] + 0.5;
                    }
                    rightest = max(rightest, x1);
                }


                if ((rightest + totalWidth) * gridSizeHere > p.windowWidth - padding * 2 && wordsNum != lastWordsNum) {

                    lineFeed.push(wordsNum)
                    totalWidth -= cumulateWidth - 1
                    lastWordsNum = wordsNum
                }

                totalWidth += rightest + blank;
            }

            totalWidth -= blank;
        }

        //posX = (p.windowWidth - totalWidth * gridSizeHere) / 2;


        //开始绘制
        let currentRight = 0;
        let currentIndex = 0;

        let currentLine = 0;

        wordsNum = 0

        
        if (gridSizeHere * 7 * (lineFeed.length + 1) + lineFeed.length * lineSpace + padding * 2 > wProp.w2.height ) {
            
        }
        
        //纵向居中
        //posY = wProp.w2.height / 2 - gridSizeHere * 7 * (lineFeed.length + 1) / 2 - lineFeed.length * lineSpace / 2
        //纵向置底
        posY = wProp.w2.height - gridSizeHere * 7 * (lineFeed.length + 1) - lineFeed.length * lineSpace - padding

        for (let i = 0; i < letterArray.length; i++) {

            const word = dict[letterArray[i]];

            if (letterArray[i] == ' ') {
                wordsNum++
            }

            


            if (lineFeed[currentLine] == wordsNum && wordsNum != 0) {

                currentLine++
                currentRight = -blank

                posY += gridSizeHere * 7 + lineSpace
                //posY += gridSizeHere + lineSpace
            }

            let rightest = 0;
            for (j = 0; j < word.length; j++) {
                let x0, y0, x1, y1;
                //判断是否是多重数组
                if (word[j][0][0] != undefined) {
                    //矩形的起点
                    x0 = word[j][0][0];
                    y0 = word[j][0][1];
                    //矩形的终点
                    x1 = word[j][1][0];
                    y1 = word[j][1][1];
                } else {
                    //矩形的起点
                    x0 = word[j][0] - 0.5;
                    y0 = word[j][1] - 0.5;
                    //矩形的终点
                    x1 = word[j][0] + 0.5;
                    y1 = word[j][1] + 0.5;
                }

                for (let x = x0 + 0.5; x < x1; x++) {
                    for (let y = y0 + 0.5; y < y1; y++) {






                        myDots[currentIndex].targetX = x * gridSizeHere + currentRight * gridSizeHere + posX +1*moveSpaceHere * cos(p.frameCount / 15 + currentIndex / 5 * moveControl);
                        //myDots[currentIndex].targetX = x * gridSizeHere + currentRight * gridSizeHere + posX;
                        myDots[currentIndex].targetY = y * gridSizeHere + posY + 2*moveSpaceHere * sin(p.frameCount / 15 + currentIndex / 5 * moveControl);

                        //myDots[currentIndex].targetY = y * gridSizeHere + posY;
                        myDots[currentIndex].state = ratioControl

                        myDots[currentIndex].size = dotSize

                        myDots[currentIndex].updateAndDisplay();
                        currentIndex++;
                    }
                }




                rightest = max(rightest, x1);


            }
            currentRight += rightest + blank;


        }

        for (let i = 0; i < myDots.length; i++) {
            myDots[i].state = 0;
        }


    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60)
        //gui = createGui('p5.gui');
        //gui.addGlobals('lerpRatio2', 'dotSize', 'gridSize', 'moveSpace', 'moveControl','ratioControl')


    }

    p.draw = function () {


        p.clear()

        p.fill(255);

        p.rect(0, wProp.w1.height, p.windowWidth, wProp.w2.height);

        //p.fill(255 / 2 -50);

        p.noStroke()

        //网格点阵
        if (false) {
            p.fill(255 / 2 - 10);
            for (let i = 0; i < p.windowWidth; i += 40) {
                for (let j = 0; j < p.windowHeight; j += 40) {
                    p.ellipse(i, j, 30, 30);
                }
            }
        }



        p.fill(0);

        /*
        myDot.originX = p.mouseX;
        myDot.originY = p.mouseY;
        myDot.state = p.mouseX/p.windowWidth;
        myDot.updateAndDisplay();
        */

        //打印帧率(取整数)
        //console.log(p.frameRate().toFixed(0));

        Show(textInput);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

}



let myp5 = new p5(sketch2, 'canvas2');




