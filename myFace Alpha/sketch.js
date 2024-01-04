let canvas;
let lips = [];

let smoothingFactor = 0.6; // 平滑因子，取值范围是 0 到 1。值越大，平滑效果越强。
let smoothedDetections = null;

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

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id("canvas");
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    clear();
    //circle(mouseX, mouseY, 20);
    if (detections != undefined) {
        updateDetections(detections);
        lips[0] = new myLips(smoothedDetections, false);
        lips[0].draw(canvas.width / 2 - 200, canvas.height / 2 - 200, 400, 320);
    }


}

class myLips {
    constructor(input, isReturn) {
        this.upperLip = [input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[308], input[415], input[310], input[311], input[312], input[13], input[82], input[80], input[191], input[78], input[61]];

        this.lowerLip = [input[78], input[95], input[88], input[178], input[87], input[14], input[317], input[402], input[318], input[324], input[308], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61], input[78]];

        this.outLip = [input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61]];

        this.inLip = [input[78], input[191], input[80], input[82], input[13], input[312], input[311], input[310], input[415], input[308], input[324], input[402], input[317], input[14], input[87], input[178], input[88], input[95], input[78]];

        this.left = input[61];
        this.right = input[291];
        this.top = input[0];
        this.bottom = input[17];

        this.isReturn = isReturn;
    }
    draw(posX, posY, meshSize, width) {
        let xyRatio = 0.75
        let sizeRatio = width / (this.right.x - this.left.x);
        let height = sizeRatio * (this.bottom.y - this.top.y) * xyRatio;
        let leftMargin = (meshSize - width) / 2;
        let topMargin = (meshSize - height) / 2;

        fill(200, 255);
        noStroke();

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