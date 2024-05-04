
let lerpRatio2 = 0.07


let testText = 'HELLO'

class dot {
    constructor(x, y, p) {
        this.p = p;


        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;


        this.size = 18
        this.fill = 'rgba(0, 0, 0, 1)'



        this.originX = x;
        this.originY = y;
        this.targetX = x;
        this.targetY = y;

        this.state = 0;

    }

    updateAndDisplay() {

        
        this.xInput = this.originX*(1-this.state)+this.targetX*this.state;
        this.yInput = this.originY*(1-this.state)+this.targetY*this.state;

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
    let myDots = Array.from({ length: 500 }, () => new dot(0, 0, p));


    //定义显示网格点阵字体的函数

    function Show(words) {
        //定义网格间距
        let gridSize = 10;

        let posX = 40;
        let posY = newWindowsProp.w1.height + (newWindowsProp.w2.height-gridSize*7)/2;

        let wordsArray = words.split('');
        //累加每个字符的最大宽度
        let totalWidth = 0;
        if (wordsArray.length > 0) {
            for (let i = 0; i < wordsArray.length; i++) {
                const word = dict[wordsArray[i]];
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
                totalWidth += rightest + 2;
            }

            totalWidth -= 2;

            //开始绘制
            let currentRight = 0;
            let currentIndex = 0;
            for (let i = 0; i < wordsArray.length; i++) {
                const word = dict[wordsArray[i]];
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
                            myDots[currentIndex].targetX = x * gridSize + currentRight * gridSize + posX;
                            myDots[currentIndex].targetY = y * gridSize + posY;
                            
                            myDots[currentIndex].state = 1;
                            myDots[currentIndex].updateAndDisplay();
                            currentIndex++;
                        }
                    }




                    rightest = max(rightest, x1);

                }
                currentRight += rightest + 2;
            }

        }
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(120)
    }

    p.draw = function () {


        p.clear()

        p.fill(255);

        p.rect(0, newWindowsProp.w1.height, p.windowWidth, newWindowsProp.w2.height);

        //p.fill(255 / 2 -50);
        
        p.noStroke()

        //网格点阵
        if (false) {
            p.fill(255/2-10);
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

        Show(TextInput);
    }

}


let myp5 = new p5(sketch2, 'canvas2');




