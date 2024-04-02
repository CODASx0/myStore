let detections;
let globalImage;


const isDecorated = true;
let decorationLength = 8;
let decorationWeight = 3;


//绘制像素字(v0）
function drawMeshType(key, posX, posY, wid, hei, radio) {
    const mesh = dict[key];
    for (let i = 0; i < mesh.length; i++) {
        let x0, y0, x2, y2;
        //判断是否是多重数组
        if (mesh[i][0][0] != undefined) {
            //矩形的起点
            x0 = mesh[i][0][0];
            y0 = mesh[i][0][1];
            //矩形的终点
            x2 = mesh[i][1][0];
            y2 = mesh[i][1][1];

        } else {
            //矩形的起点
            x0 = mesh[i][0] - 0.5;
            y0 = mesh[i][1] - 0.5;
            //矩形的终点
            x2 = mesh[i][0] + 0.5;
            y2 = mesh[i][1] + 0.5;
        }

        let x1 = posX + wid[Math.floor(x0)] * (x0 % 1);
        let y1 = posY + hei[Math.floor(y0)] * (y0 % 1);

        for (let j = 0; j < Math.floor(x0); j++) {
            x1 += wid[j]
        }
        for (let j = 0; j < Math.floor(y0); j++) {
            y1 += hei[j]
        }

        let x3 = posX + wid[Math.floor(x2)] * (x2 % 1);
        let y3 = posY + hei[Math.floor(y2)] * (y2 % 1);

        for (let j = 0; j < Math.floor(x2); j++) {
            x3 += wid[j]
        }
        for (let j = 0; j < Math.floor(y2); j++) {
            y3 += hei[j]
        }


        noStroke();
        fill(0)
        rect(x1, y1, x3 - x1, y3 - y1, radio, radio, radio, radio);
        //console.log(x1, y1, x3 - x1, y3 - y1)

        if (isDecorated) {
            stroke(255, 200)
            strokeWeight(decorationWeight)
            line(x1 - decorationLength / 2, y1, x1 + decorationLength / 2, y1)
            line(x1, y1 - decorationLength / 2, x1, y1 + decorationLength / 2)
            line(x3 - decorationLength / 2, y1, x3 + decorationLength / 2, y1)
            line(x3, y1 - decorationLength / 2, x3, y1 + decorationLength / 2)
            line(x1 - decorationLength / 2, y3, x1 + decorationLength / 2, y3)
            line(x1, y3 - decorationLength / 2, x1, y3 + decorationLength / 2)
            line(x3 - decorationLength / 2, y3, x3 + decorationLength / 2, y3)
            line(x3, y3 - decorationLength / 2, x3, y3 + decorationLength / 2)
        }

    }


    if (isDecorated) {
        stroke(255, 120)
        strokeWeight(decorationWeight)
        noFill()
        let nowX = posX;
        for (i = 0; i < wid.length; i++) {
            let nowY = posY;
            for (j = 0; j < hei.length; j++) {
                line(nowX - decorationLength / 2, nowY, nowX + decorationLength / 2, nowY);
                line(nowX, nowY - decorationLength / 2, nowX, nowY + decorationLength / 2);
                //ellipse(nowX, nowY, decorationLength*2, decorationLength*2)
                nowY += hei[j]
            }
            nowX += wid[i]
        }

        /*
        for (i = 0; i < mesh.length; i++) {
        if (mesh[i][0][0] === undefined) {
            
        
        }
        */
    }


    let widSum;
    for (let i = 0; i < wid.length; i++) {
        widSum += wid[i]
    }

    return widSum;
}

//绘制像素字（v1）
function drawMeshTypeAdvance(words, windowProp, recordData) {
    //单位长度
    let unitWidth = 10;

    let ratio = 8;

    //words是一个字符串，每个字符都是一个字母，创建一个数组分别储存
    let wordsArray = words.split('');

    //累加每个字符的最大宽度
    let totalWidth = 0;
    if (recordData.length > 1 && wordsArray.length > 0) {
        //console.log(recordData)
        for (let i = 0; i < wordsArray.length; i++) {
            const word = dict[wordsArray[i]];
            //最右边界
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
                rightest = max(rightest, x1);
            }
            totalWidth += rightest + 1;
        }


        let currentRight = 0;
        for (let i = 0; i < wordsArray.length; i++) {
            const word = dict[wordsArray[i]];
            //最右边界
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

                for (let x = x0; x < x1; x += 0.1) {
                    let x01 = (currentRight + x) / totalWidth
                    let x02 = (currentRight + x + 0.1) / totalWidth

                    let x01left = Math.floor(x01 * (recordData.length - 1));
                    let x01right = Math.ceil(x01 * (recordData.length - 1));

                    let x02left = Math.floor(x02 * (recordData.length - 1));
                    let x02right = Math.ceil(x02 * (recordData.length - 1));

                    let x01leftValue = (recordData[x01left].inBottom.y - recordData[x01left].inTop.y) * windowProp.height * ratio;
                    let x01rightValue = (recordData[x01right].inBottom.y - recordData[x01right].inTop.y) * windowProp.height * ratio;

                    let x02leftValue = (recordData[x02left].inBottom.y - recordData[x02left].inTop.y) * windowProp.height * ratio;

                    let x02rightValue = (recordData[x02right].inBottom.y - recordData[x02right].inTop.y) * windowProp.height * ratio;

                    let x01lerp = x01 * (recordData.length - 1) - x01left;
                    let x02lerp = x02 * (recordData.length - 1) - x02left;

                    let x01Value = lerp(x01leftValue, x01rightValue, x01lerp);
                    let x02Value = lerp(x02leftValue, x02rightValue, x02lerp)

                    let x01heightUnit = x01Value / 7;
                    let x02heightUnit = x02Value / 7;


                    unitWidth = windowProp.width / (totalWidth - 1);
                    fill(255)

                    stroke(255);


                    //strokeWeight(4);

                    noStroke()


                    beginShape(2);
                    vertex(x01 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x01Value / 2 + x01heightUnit * y0);
                    vertex(x02 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x02Value / 2 + x02heightUnit * y0);
                    vertex(x02 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x02Value / 2 + x02heightUnit * y1);
                    vertex(x01 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x01Value / 2 + x01heightUnit * y1);


                    endShape(CLOSE);

                    if (false) {
                        strokeWeight(1);
                        fill(255, 0, 0)

                        ellipse(x01 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x01Value / 2 + x01heightUnit * y0, 5, 5);
                        ellipse(x02 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x02Value / 2 + x02heightUnit * y0, 5, 5);
                        ellipse(x02 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x02Value / 2 + x02heightUnit * y1, 5, 5);
                        ellipse(x01 * totalWidth * unitWidth + windowProp.posX, windowProp.height / 2 + windowProp.posY - x01Value / 2 + x01heightUnit * y1, 5, 5);

                    }




                }
                rightest = max(rightest, x1);

            }
            currentRight += rightest + 1;


            //console.log(currentRight)
        }
    }

}

//绘制圆圈像素字（v2）
function drawMeshTypeAdvanceV2(words, windowProp, recordData) {
    //单位长度
    let unitWidth = 10;

    let ratio = 8;

    //words是一个字符串，每个字符都是一个字母，创建一个数组分别储存
    let wordsArray = words.split('');

    //累加每个字符的最大宽度
    let totalWidth = 0;
    if (recordData.length > 1 && wordsArray.length > 0) {
        //console.log(recordData)
        for (let i = 0; i < wordsArray.length; i++) {
            const word = dict[wordsArray[i]];
            //最右边界
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
                rightest = max(rightest, x1);
            }
            totalWidth += rightest + 1;
        }


        let currentRight = 0;
        for (let i = 0; i < wordsArray.length; i++) {
            const word = dict[wordsArray[i]];
            //最右边界
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

                let wordWidth = x1 - x0;
                let wordHeight = y1 - y0;

                if (wordWidth === 1 && wordHeight >= 1) {

                    let x = (currentRight + x0 + 0.5) / totalWidth;
                    let xLeft = Math.floor(x * (recordData.length - 1));
                    let xRight = Math.ceil(x * (recordData.length - 1));
                    let xLeftValue = (recordData[xLeft].outBottom.y - recordData[xLeft].inTop.y) * windowProp.height * ratio;
                    let xRightValue = (recordData[xRight].outBottom.y - recordData[xRight].inTop.y) * windowProp.height * ratio;
                    let xlerp = x * (recordData.length - 1) - xLeft;

                    let xValue = lerp(xLeftValue, xRightValue, xlerp);

                    let xHeightUnit = xValue / 7;

                    drawVariableLine(
                        x * totalWidth * unitWidth + windowProp.posX,
                        windowProp.height / 2 + windowProp.posY - xValue / 2 + xHeightUnit * (y0 + 0.5),
                        unitWidth / 2,
                        x * totalWidth * unitWidth + windowProp.posX,
                        windowProp.height / 2 + windowProp.posY - xValue / 2 + xHeightUnit * (y1 - 0.5),
                        unitWidth / 2
                    );



                } else if (wordWidth >= 1 && wordHeight === 1) {


                } else if (wordWidth === 1 && wordHeight === 1) {

                }


                rightest = max(rightest, x1);

            }
            currentRight += rightest + 1;


            //console.log(currentRight)
        }
    }

}

//计算嘴部点位的相关信息
class LipsData {
    constructor(detections) {
        this.left = detections[61];
        this.right = detections[291];

        this.inTop = detections[13];
        this.inBottom = detections[14];

        this.outTop = detections[0];
        this.outBottom = detections[17];
    }

}


async function startWebcam() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    // 选择第二个视频输入设备
    const constraints = {
        video: {
            deviceId: videoDevices[0].deviceId
        }
    };

    video = createCapture(constraints);
    video.hide();
}


function drawVariableLine(x0, y0, r0, x1, y1, r1) {
    fill(200);
    stroke(255); // 设置切线的颜色
    //noStroke();
    strokeWeight(1);

    // 计算两个圆心之间的距离
    let d = dist(x0, y0, x1, y1);

    // 检查一个圆是否完全覆盖另一个圆
    if (abs(r1 - r0) >= d) {
        // 如果是，则只绘制较大的那个圆
        if (r0 > r1) {
            // 第一个圆较大
            ellipse(x0, y0, r0 * 2, r0 * 2);
        } else {
            // 第二个圆较大
            ellipse(x1, y1, r1 * 2, r1 * 2);
        }
    } else {
        // 如果没有圆完全覆盖另一个圆，则继续绘制两个圆的外公切线和圆弧


        // 计算外公切线的端点和角度
        let a = atan2(y1 - y0, x1 - x0);
        let b = acos((r0 - r1) / d);

        // 绘制外公切线和圆弧
        let tx1 = x0 + cos(a + b) * r0;
        let ty1 = y0 + sin(a + b) * r0;
        let tx2 = x1 + cos(a + b) * r1;
        let ty2 = y1 + sin(a + b) * r1;

        let tx3 = x0 + cos(a - b) * r0;
        let ty3 = y0 + sin(a - b) * r0;
        let tx4 = x1 + cos(a - b) * r1;
        let ty4 = y1 + sin(a - b) * r1;

        // 绘制切线



        line(tx1, ty1, tx2, ty2);
        line(tx3, ty3, tx4, ty4);

        // 绘制圆弧
        let startAngle0 = atan2(ty1 - y0, tx1 - x0);
        let endAngle0 = atan2(ty3 - y0, tx3 - x0);

        let startAngle1 = atan2(ty4 - y1, tx4 - x1);
        let endAngle1 = atan2(ty2 - y1, tx2 - x1);

        if (false) {
            arc(x0, y0, r0 * 2, r0 * 2, startAngle0, endAngle0);
            arc(x1, y1, r1 * 2, r1 * 2, startAngle1, endAngle1);
        } else {
            ellipse(x0, y0, r0 * 2, r0 * 2);
            ellipse(x1, y1, r1 * 2, r1 * 2);
        }

        noStroke()
        beginShape();

        vertex(x0, y0);
        vertex(tx1, ty1);
        vertex(tx2, ty2);
        vertex(x1, y1);
        vertex(tx4, ty4);
        vertex(tx3, ty3);
        endShape(CLOSE);


    }
}


















