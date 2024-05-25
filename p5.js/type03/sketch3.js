let panelWidth = 180

let valueNow = 0

let sketch3 = function (p) {

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60)
        //wProp.w2.height = p.windowHeight
    }

    p.draw = function () {


        let value = debug
        let valueMax = debugMax
        let valueMin = debugMin

        valueNow = p.lerp(valueNow, p.map(value, valueMin, valueMax, 0, panelWidth), lerpRatio2)
        let xInput = p.mouseX - (p.windowWidth / 2 - panelWidth / 2)

        if (p.mouseX > p.windowWidth / 2 - panelWidth / 2 && p.mouseX < p.windowWidth / 2 + panelWidth / 2) {
            debug = p.map(xInput, 0, panelWidth, valueMin, valueMax)
        } else if (p.mouseX > p.windowWidth / 2 + panelWidth / 2) { 
            debug = valueMax
        } else if (p.mouseX < p.windowWidth / 2 - panelWidth / 2) {
            debug = valueMin
        }

        p.clear()
        p.fill(0)

        //p.rect(p.windowWidth / 2, controlPanelY, 500, 500)
        p.strokeWeight(2)
        p.stroke(200)
        p.fill(255)
        p.line(p.windowWidth / 2 - panelWidth / 2, controlPanelY, p.windowWidth / 2 + panelWidth / 2, controlPanelY)
        let size = 30

        p.noStroke()
        p.ellipse(p.windowWidth / 2 - panelWidth / 2 + valueNow, controlPanelY, size, size)
        p.stroke(200)
        p.arc(p.windowWidth / 2 - panelWidth / 2 + valueNow, controlPanelY, size, size, p.PI - 0.4, p.PI + 0.4)
        p.arc(p.windowWidth / 2 - panelWidth / 2 + valueNow, controlPanelY, size, size, -0.4, 0.4)
        

        p.textSize(14)
        p.fill(0)
        p.noStroke()
        p.textAlign(p.CENTER, p.CENTER)
        p.text(Math.floor(value), p.windowWidth / 2 - panelWidth / 2 + valueNow, controlPanelY - 0)




    }
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        //wProp.w2.height = p.windowHeight
    }

}



//let myp52 = new p5(sketch3, 'canvas3');