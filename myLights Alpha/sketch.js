let port, reader, writer;
let canvas;
async function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id("canvas");

    // additional code here...

    noLoop();
    ({ port, reader, writer } = await getPort());
    loop();
    targetY = canvas.height / 2;
    frameRate(30);
}

let lightsNum = 20;
let colors = [];
let targetY;

const data = {
    array: colors
}

async function draw() {
    clear();
    if (port) {

        let meshSize = 20;
        targetY = lerp(targetY, mouseY, 0.2);

        let targetY1 = cos(frameCount / 30) * 40 + 80;
        let targetY2 = cos(frameCount / 60) * 40 + 80;
        let targetY3 = cos(frameCount / 20) * 40 + 80;

        let targetY01 = cos(frameCount / 90) * 200 + canvas.height / 2;
        let targetY02 = cos(frameCount / (90 + targetY2 * 0.01) + 0.08) * 200 + canvas.height / 2;
        let targetY03 = cos(frameCount / (90 + targetY3 * 0.01) + 0.16) * 200 + canvas.height / 2;

        for (i = 0; i < lightsNum; i++) {
            y = canvas.height / 2 - lightsNum * meshSize / 2 + i * meshSize;

            //设定灯柱的样式
            let c1 = mySin(y, 20, targetY01, 30, targetY1);
            let c2 = mySin(y, 20, targetY02, 30, targetY1 + targetY2 * 0.02);
            let c3 = mySin(y, 20, targetY03, 30, targetY1 + targetY3 * 0.02);
            fill(c1 * 3, c2 * 3, c3 * 3, 255);
            stroke(255);
            rect(canvas.width / 2 - meshSize / 2, y, meshSize, meshSize);
            colors[i * 3] = c1;
            colors[i * 3 + 1] = c2;
            colors[i * 3 + 2] = c3;
        }


        const jsonData = JSON.stringify(data);
        try {
            await writer.write(jsonData);
        } catch (e) { console.error(e) }

    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mySin(xInput, y1, x0, xR0, xR1) {
    let distance = abs(xInput - x0);
    let output;
    if (distance < xR0 / 2) {
        output = int(y1);
    } else if (distance < xR0 / 2 + xR1) {
        let xR = distance - xR0 / 2;
        let output0 = 0.5 * cos(map(xR, 0, xR1, 0, PI)) + 0.5;
        output = int(output0 * y1);
    } else {
        output = 0;
    }
    return output;

}
