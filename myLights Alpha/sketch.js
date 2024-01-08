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
        for (i = 0; i < lightsNum; i++) {
            y = canvas.height / 2 - lightsNum * meshSize / 2 + i * meshSize;

            //设定灯柱的样式
            let a = mySin(y, 100, targetY, 0, 200);

            fill(a, a, a);
            rect(canvas.width / 2 - meshSize / 2, y, meshSize, meshSize);
            colors[i] = a;
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
