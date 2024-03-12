//绘制参考坐标
function drawSpaceLine(w, h, z, wIndex, hIndex, zIndex, length,weight) {
    let zd = z / (zIndex - 1);
    let wd = w / (wIndex - 1);
    let hd = h / (hIndex - 1);
    strokeWeight(weight)
    for (k = 0; k < zIndex; k++) {
        for (i = 0; i < wIndex ; i++) {
            push()
            translate(-w / 2 + i * wd, -h / 2, -k * zd);
            stroke(255, 0, 0);
            line(-length / 2, 0, 0, length / 2, 0, 0);
            stroke(0, 255, 0);
            line(0, -length / 2, 0, 0, length / 2, 0);
            stroke(0, 0, 255);
            line(0, 0, -length / 2, 0, 0, length / 2);
            pop()
        }

        for (i = 0; i < hIndex ; i++) {
            push()
            translate(-w / 2, -h / 2 + i * hd, -k * zd);
            stroke(255, 0, 0);
            line(-length / 2, 0, 0, length / 2, 0, 0);
            stroke(0, 255, 0);
            line(0, -length / 2, 0, 0, length / 2, 0);
            stroke(0, 0, 255);
            line(0, 0, -length / 2, 0, 0, length / 2);
            pop()
        }

        for (i = 0; i < wIndex ; i++) {
            push()
            translate(-w / 2 + i * wd, h / 2, -k * zd);
            stroke(255, 0, 0);
            line(-length / 2, 0, 0, length / 2, 0, 0);
            stroke(0, 255, 0);
            line(0, -length / 2, 0, 0, length / 2, 0);
            stroke(0, 0, 255);
            line(0, 0, -length / 2, 0, 0, length / 2);
            pop()
        }

        for (i = 0; i < hIndex; i++) {
            push()
            translate(w / 2, -h / 2 + i * hd, -k * zd);
            stroke(255, 0, 0);
            line(-length / 2, 0, 0, length / 2, 0, 0);
            stroke(0, 255, 0);
            line(0, -length / 2, 0, 0, length / 2, 0);
            stroke(0, 0, 255);
            line(0, 0, -length / 2, 0, 0, length / 2);
            pop()
        }
    }


}

class myLips {
    constructor(input, isReturn, time) {
        this.upperLip = [input[62], input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[308], input[415], input[310], input[311], input[312], input[13], input[82], input[80], input[191], input[78]];
        this.lowerLip = [input[78], input[95], input[88], input[178], input[87], input[14], input[317], input[402], input[318], input[324], input[308], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61], input[62], input[78]];
        this.outLip = [input[61], input[185], input[40], input[39], input[37], input[0], input[267], input[269], input[270], input[409], input[291], input[375], input[321], input[405], input[314], input[17], input[84], input[181], input[91], input[146], input[61]];
        this.inLip = [input[78], input[191], input[80], input[82], input[13], input[312], input[311], input[310], input[415], input[308], input[324], input[402], input[317], input[14], input[87], input[178], input[88], input[95], input[78]];

        this.left = input[61];
        this.right = input[291];
        this.top = input[0];
        this.bottom = input[17];

        this.isReturn = isReturn;
        this.time = time;
        this.type = "lips";
        this.isSelect = false;
    }
    drawM(posX, posY, meshSize, width) {

        //绘制马赛克

        //马赛克精细度



        let xyRatio = 0.75
        let sizeRatio = width / (this.right.x - this.left.x);
        let height = sizeRatio * (this.bottom.y - this.top.y) * xyRatio;
        let leftMargin = (meshSize - width) / 2;
        let topMargin = (meshSize - height) / 2;

        //fill(color, alpha);

        stroke(0);
        strokeWeight(4)
        //noStroke()

        //检查是否被鼠标选中


        for (let x1 = -meshSize/mMeshSize; x1 < meshSize/mMeshSize; x1++) {
            for (let y1 = -meshSize/mMeshSize; y1 < meshSize/mMeshSize; y1++) {
                let intersectCount1 = 0;
                let intersectCount2 = 0;
                let point = { x: x1 * mMeshSize, y: y1 * mMeshSize }

                for (let i = 0; i < this.outLip.length - 1; i++) {
                    let p1 = {
                        x: posX + leftMargin + (this.outLip[i].x - this.left.x) * sizeRatio,
                        y: posY + topMargin + (this.outLip[i].y - this.top.y) * sizeRatio * xyRatio
                    };
                    let p2 = {
                        x: posX + leftMargin + (this.outLip[i + 1].x - this.left.x) * sizeRatio,
                        y: posY + topMargin + (this.outLip[i + 1].y - this.top.y) * sizeRatio * xyRatio
                    };
                    if (p1.y > point.y != p2.y > point.y && point.x < (p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x) {
                        intersectCount1++;
                    }
                }
                for (let i = 0; i < this.inLip.length - 1; i++) {
                    let p1 = {
                        x: posX + leftMargin + (this.inLip[i].x - this.left.x) * sizeRatio,
                        y: posY + topMargin + (this.inLip[i].y - this.top.y) * sizeRatio * xyRatio
                    };
                    let p2 = {
                        x: posX + leftMargin + (this.inLip[i + 1].x - this.left.x) * sizeRatio,
                        y: posY + topMargin + (this.inLip[i + 1].y - this.top.y) * sizeRatio * xyRatio
                    };
                    if (p1.y > point.y != p2.y > point.y && point.x < (p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x) {
                        intersectCount2++;
                    }
                }

                if (intersectCount1 % 2 === 1 &&   intersectCount2 % 2 === 0) {
                    fill(0, 0, 0, 100)
                    noStroke()
                    rect(-point.x - mMeshSize, point.y - mMeshSize, mMeshSize * 2, mMeshSize * 2)
                }
            }
        }

        push()
        translate(0,0,mouse.posZ)
        fill(255)
        beginShape();
        for (let i = 0; i < this.upperLip.length -1; i++) {
            let inputX = this.upperLip[i].x;
            let inputY = this.upperLip[i].y;
            let inputZ = this.upperLip[i].z;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            let outputZ = inputZ * sizeRatio;
            curveVertex(-outputX, outputY, -outputZ);
        }
        endShape(CLOSE);

        beginShape();
        for (let i = 0; i < this.lowerLip.length-1 ; i++) {
            let inputX = this.lowerLip[i].x;
            let inputY = this.lowerLip[i].y;
            let inputZ = this.lowerLip[i].z;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            let outputZ = inputZ * sizeRatio;
            curveVertex(-outputX, outputY, -outputZ);
        }
        endShape(CLOSE);
        pop()
    }
    draw(posX, posY, meshSize, width) {


        //绘制马赛克

        //马赛克精细度



        let xyRatio = 0.75
        let sizeRatio = width / (this.right.x - this.left.x);
        let height = sizeRatio * (this.bottom.y - this.top.y) * xyRatio;
        let leftMargin = (meshSize - width) / 2;
        let topMargin = (meshSize - height) / 2;

        //fill(color, alpha);

        stroke(0);
        strokeWeight(4)
        //noStroke()

        
        push()
        translate(0, 0, mouse.posZ)
        fill(255)
        beginShape();
        for (let i = 0; i < this.upperLip.length - 1; i++) {
            let inputX = this.upperLip[i].x;
            let inputY = this.upperLip[i].y;
            let inputZ = this.upperLip[i].z;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            let outputZ = inputZ * sizeRatio;
            curveVertex(-outputX, outputY, -outputZ);
        }
        endShape(CLOSE);

        beginShape();
        for (let i = 0; i < this.lowerLip.length - 1; i++) {
            let inputX = this.lowerLip[i].x;
            let inputY = this.lowerLip[i].y;
            let inputZ = this.lowerLip[i].z;
            let outputX = posX + leftMargin + (inputX - this.left.x) * sizeRatio;
            let outputY = posY + topMargin + (inputY - this.top.y) * sizeRatio * xyRatio;
            let outputZ = inputZ * sizeRatio;
            curveVertex(-outputX, outputY, -outputZ);
        }
        endShape(CLOSE);
        pop()
    }

}

function updateDetections(Detections) {
    let newDetections = JSON.parse(JSON.stringify(Detections))
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