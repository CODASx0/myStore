
let lerpRatio2 = 0.4

class dot {
    constructor(x, y, p) {
        this.p = p;


        this.x = x;
        this.y = y;
        this.lastX = x;
        this.lastY = y;


        this.size = 20

    }

    updateAndDisplay() {


        this.xInput = this.p.mouseX;
        this.yInput = this.p.mouseY;

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
        this.p.ellipse(0, 0, this.size + this.distance * 2, this.size);


        this.p.pop()

        this.lastX = this.x;
        this.lastY = this.y;

    }

}

let sketch2 = function (p) {

    let myDot = new dot(0, 0, p);


    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60)
    }

    p.draw = function () {


        p.clear()

        p.fill(255);

        p.rect(0, newWindowsProp.w1.height, p.windowWidth, newWindowsProp.w2.height);

        p.fill(255 / 2 + 3);
        p.noStroke()
        for (let i = 0; i < p.windowWidth; i += 10) {
            p.ellipse(i + 20 * sin(p.frameCount * 0.05 + i*1), newWindowsProp.w1.height + newWindowsProp.w2.height / 2, 80, 160);
        }


        p.fill(0);

        myDot.updateAndDisplay();

        //打印帧率(取整数)
        console.log(p.frameRate().toFixed(0));

    }

}


let myp5 = new p5(sketch2, 'canvas2');

