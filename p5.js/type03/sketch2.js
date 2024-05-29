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
        height: 400,
    }
}

let newWP = {
    posY:20,
    padding: 20,
    p1: {
        height:50,
    },
    
    w1: {
        posX: 0,
        posY: 0,
        width: 160,
        height: 120,
    },
    w2: {
        width: 600,
        widthO: 600,
        height: 120,
        widthX:1
    },
}

let controlPanelY = 0;




var lerpRatio2 = 0.08
var lerpRatio2Min = 0.01
var lerpRatio2Max = 0.5
var lerpRatio2Step = 0.01

var dotSize = 16
var dotSizeMin = 14
var dotSizeMax = 50
var dotSizeStep = 0.1

var gridSize = 10
var gridSizeMin = 4
var gridSizeMax = 40
var gridSizeStep = 0.5

var moveSpace = 4
var moveSpaceMin = 0;
var moveSpaceMax = 30;
var moveSpaceStep = 0.1

var moveControl = 0.2;
var moveControlMin = 0;
var moveControlMax = 2;
var moveControlStep = 0.01

var ratioControl = 1;
var ratioControlMin = 0;
var ratioControlMax = 1;
var ratioControlStep = 0.01;

var typePadding = 40;
var typePaddingMin = 0;
var typePaddingMax = 200;
var typePaddingStep = 1;

var debug = 0;
var debugMin = 0;
var debugMax = 1;
var debugStep = 0.01;

let panelSwitch = false;



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

    update() {


        this.xInput = this.originX * (1 - this.state) + this.targetX * this.state;
        this.yInput = this.originY * (1 - this.state) + this.targetY * this.state;

        this.x = this.p.lerp(this.x, this.xInput, lerpRatio2);
        this.y = this.p.lerp(this.y, this.yInput, lerpRatio2);
        //间隔移动距离
        this.distance = this.p.dist(this.x, this.y, this.lastX, this.lastY);

       






    }

    updateFinal() {
        //更新上一次的位置
        this.lastX = this.x;
        this.lastY = this.y;
    }


    display() { 
        this.p.push()

        if (this.distance != 0) {
            this.rotation = this.p.atan2(this.y - this.lastY, this.x - this.lastX);
        }
        this.p.translate(this.x, this.y);
        this.p.rotate(this.rotation);
        this.p.fill(this.p.color(this.fill));
        //this.p.ellipse(0, 0, this.size + this.distance * 1, this.size);

        this.cornerRatio = 1


        this.p.ellipse(0, 0, this.size, this.size);
        /*

        this.p.rect(
            -this.size / 2,
            -this.size / 2,
            this.size + this.distance * 1,
            this.size, this.size / 2 * this.cornerRatio,
            this.size / 2 * this.cornerRatio,
            this.size / 2 * this.cornerRatio,
            this.size / 2 * this.cornerRatio
        );

        */
        this.p.pop()
    }



}

let sketch2 = function (p) {

    let myDot = new dot(0, 0, p);
    //创建一个数量500的myDots数组并存放dot对象
    let myDots = Array.from({ length: 10000 }, () => new dot(p.windowWidth/2, p.windowHeight/2, p));


    //定义显示网格点阵字体的函数

    function Show(words) {
        //定义网格间距
        let padding = typePadding

        let gridSizeHere = gridSize
        let gridSizeYHere = gridSize * 1.1

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

        let totalWidth2 = 0;

        let cumulateWidth = 0;

        //校准换行的位置
        let lineFeed = []
        //储存各行的宽度
        let lineWidth = []

        let currentLine = 0;

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
                    lineWidth[currentLine] = cumulateWidth - blank
            
                    currentLine++
                    totalWidth -= cumulateWidth - 1
                    lastWordsNum = wordsNum
                }

               
                lineWidth[currentLine] = rightest + totalWidth

                
                totalWidth += rightest + blank;
                totalWidth2 += rightest + blank;
            }

            totalWidth -= blank;
            totalWidth2 -= blank;
        }

        //posX = (p.windowWidth - totalWidth * gridSizeHere) / 2;


        //开始绘制
        let currentRight = 0;
        let currentRight2 = 0;

        let currentIndex = 0;

        currentLine = 0;

        wordsNum = 0


        if (gridSizeHere * 7 * (lineFeed.length + 1) + lineFeed.length * lineSpace + padding * 2 > wProp.w2.height) {

        }

        //纵向居中
        //posY = wProp.w2.height / 2 - gridSizeYHere * 7 * (lineFeed.length + 1) / 2 - lineFeed.length * lineSpace / 2

        //全屏
        posY = p.windowHeight / 2 - gridSizeYHere * 7 * (lineFeed.length + 1) / 2 - lineFeed.length * lineSpace / 2


        //纵向置底
        //posY = wProp.w2.height - gridSizeYHere * 7 * (lineFeed.length + 1) - lineFeed.length * lineSpace - padding

        controlPanelY = posY + gridSizeYHere * 7 * (lineFeed.length + 1) + lineFeed.length * lineSpace + padding

        for (let i = 0; i < letterArray.length; i++) {

            const word = dict[letterArray[i]];

            if (letterArray[i] == ' ') {
                wordsNum++
            }




            if (lineFeed[currentLine] == wordsNum && wordsNum != 0) {

                currentLine++
                currentRight = -blank

                posY += gridSizeYHere * 7 + lineSpace
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
                        let y00 = y
                        if (lipsInput.length > 0) {

                            x00 = (currentRight2 + x) / totalWidth2
                            //console.log(x00)
                            x00left = Math.floor(x00 * (lipsInput.length - 1))
                            x00right = Math.ceil(x00 * (lipsInput.length - 1))
                            xNow = x00 * (lipsInput.length - 1) - x00left

                            if (lipsInput[x00left].height0 != undefined && lipsInput[x00right].height0 != undefined) {
                                y00 = lerp(pickY(y, lipsInput[x00left].posY0, lipsInput[x00left].img.height, lipsInput[x00left].height0), pickY(y, lipsInput[x00right].posY0, lipsInput[x00right].img.height, lipsInput[x00right].height0), xNow)
                            }
                        }

                        let y01 = lerp(y, y00, 1)



                        let lineWidthHere = lineWidth[currentLine] * gridSizeHere
                        if (currentLine > 0) {
                            lineWidthHere = (lineWidth[currentLine]-3) * gridSizeHere
                        }
                        //左对齐
                        //myDots[currentIndex].targetX = x * gridSizeHere + currentRight * gridSizeHere + posX + 1 * moveSpaceHere * cos(p.frameCount / 15 + currentIndex / 5 * moveControl);
                        //居中
                        myDots[currentIndex].targetX = windowWidth / 2 - lineWidthHere/2 + x * gridSizeHere + currentRight * gridSizeHere + 1 * moveSpaceHere * cos(p.frameCount / 30 + currentIndex / 5 * moveControl);
                        //console.log(lineWidth)


                        //myDots[currentIndex].targetX = x * gridSizeHere + currentRight * gridSizeHere + posX;
                        myDots[currentIndex].targetY = y01 * gridSizeYHere + posY + 2 * moveSpaceHere * sin(p.frameCount / 30 + currentIndex / 5 * moveControl);

                        //myDots[currentIndex].targetY = y * gridSizeHere + posY;
                        myDots[currentIndex].state = ratioControl

                        myDots[currentIndex].size = dotSize

                        myDots[currentIndex].update();

                        myDots[currentIndex].display();


                        myDots[currentIndex].updateFinal();

                        currentIndex++;
                    }
                }




                rightest = max(rightest, x1);


            }
            currentRight += rightest + blank;
            currentRight2 += rightest + blank;


        }

    }


    function pickY(yInput, posY0, imageHeight, height) {
        return map(yInput, 0, 7, posY0 / height * 7, (posY0 + imageHeight) / height * 7)


    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60)
        p.pixelDensity(0.5)
        
        if (panelSwitch) {
            gui = createGui('p5.gui');
            gui.addGlobals('lerpRatio2', 'dotSize', 'gridSize', 'moveSpace', 'moveControl', 'ratioControl', 'typePadding', 'debug')
        }
        

        //wProp.w2.height = p.windowHeight


    }

    p.draw = function () {


        p.clear()

        p.fill(255);

        p.rect(0, 0, p.windowWidth, p.windowHeight);

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



        //lowRateTest()

        Show(textInput);

        canvas2.style.filter = 'blur(' + 8 * (1 - debug) + 'px)';
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        //wProp.w2.height = p.windowHeight
    }

    function lowRateTest() {
        if (rateList.length > lowRateTimer) {
            let beReload = true
            rateList.shift()
            rateList.push(p.frameRate())

            for (i=0; i<rateList.length; i++) {
                if (rateList[i] >lowRateLimit) {
                    beReload = false
                }
            }

            if(beReload) {
                location.reload()
                //避免重复刷新
                rateList = []
            }
            


        } else {
            rateList.push(p.frameRate())
        }
    }

    
}

let lowRateLimit = 20
let lowRateTimer = 5
let rateList = []


let myp5 = new p5(sketch2, 'canvas2');

let canvas2 = document.getElementById('canvas2');




