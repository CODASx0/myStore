let port, reader, writer;
async function setup() {
    createCanvas(windowWidth, windowHeight);

    // additional code here...

    noLoop();
    ({ port, reader, writer } = await getPort());
    loop();
}

let lightsNum = 20;
let lights = [];

for (let i = 0; i < lightsNum; i++) {
    lights.push(new myLights(0, 0, 0));
}

async function draw() {
    if (port) {
        try {
            /*
            if (mouseIsPressed) {
                // do something...
                await writer.write("clicked!\n");
            }
            else {
                // do something...
                await writer.write("not clicked!\n");
            }

            */
        } catch (e) { console.error(e) }
    }


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mySin(  ) {

}

class myLights {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
