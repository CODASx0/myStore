function windowRect(posX, posY, windowsWidth, windowsHeight, pointList) {
    //边角修饰
    let cornerSize = 6;
    //外轮廓
    stroke(255, 40);
    strokeWeight(1);
    noFill();
    if (cornerSize > windowsWidth / 2) cornerSize = windowsWidth / 2;
    if (cornerSize > windowsHeight / 2) cornerSize = windowsHeight / 2;

    rect(posX, posY, windowsWidth, windowsHeight, cornerSize, cornerSize, cornerSize, cornerSize);





    stroke(100);
    strokeWeight(1);
    noFill();

    arc(posX + cornerSize, posY + cornerSize, cornerSize * 2, cornerSize * 2, PI, 1.5 * PI);
    line(posX + cornerSize, posY, posX + cornerSize * 1.5, posY)
    line(posX, posY + cornerSize, posX, posY + cornerSize * 1.5)
    arc(posX + windowsWidth - cornerSize, posY + cornerSize, cornerSize * 2, cornerSize * 2, 1.5 * PI, TWO_PI);
    line(posX + windowsWidth - cornerSize * 1.5, posY, posX + windowsWidth - cornerSize, posY)
    line(posX + windowsWidth, posY + cornerSize, posX + windowsWidth, posY + cornerSize * 1.5)
    arc(posX + cornerSize, posY + windowsHeight - cornerSize, cornerSize * 2, cornerSize * 2, PI / 2, PI);
    line(posX + cornerSize, posY + windowsHeight, posX + cornerSize * 1.5, posY + windowsHeight)
    line(posX, posY + windowsHeight - cornerSize * 1.5, posX, posY + windowsHeight - cornerSize)
    arc(posX + windowsWidth - cornerSize, posY + windowsHeight - cornerSize, cornerSize * 2, cornerSize * 2, 0, PI / 2);
    line(posX + windowsWidth - cornerSize * 1.5, posY + windowsHeight, posX + windowsWidth - cornerSize, posY + windowsHeight)
    line(posX + windowsWidth, posY + windowsHeight - cornerSize * 1.5, posX + windowsWidth, posY + windowsHeight - cornerSize)



    //鼠标输入点绘制
    let radio = 30
    cornerSize = cornerSize * 0.5
    if (pointList != null) {
        for (let i = 0; i < pointList.length; i++) {

            let x = pointList[i][0];
            let y = pointList[i][1];
            stroke(255, 100);
            noFill();
            ellipse(x + posX, y + posY, 10, 10);

            if (x > radio / 2 && x < windowsWidth - radio / 2 && y < windowsHeight - radio / 2 && y > radio / 2) {
                stroke(255, 40);
                strokeWeight(1);
                noFill();
                ellipse(posX + x, posY + y, radio, radio);
                line(posX, posY + y, posX + x - radio / 2, posY + y)
                line(posX + x + radio / 2, posY + y, posX + windowsWidth, posY + y)
                line(posX + x, posY, posX + x, posY + y - radio / 2)
                line(posX + x, posY + y + radio / 2, posX + x, posY + windowsHeight)

                stroke(255, 180);
                line(posX, posY + y, posX + cornerSize, posY + y)

                line(posX + windowsWidth - cornerSize, posY + y, posX + windowsWidth, posY + y)
                line(posX + x, posY, posX + x, posY + cornerSize)
                line(posX + x, posY + windowsHeight - cornerSize, posX + x, posY + windowsHeight)
                line(posX, posY + y - cornerSize, posX, posY + y + cornerSize)
                line(posX + windowsWidth, posY + y - cornerSize, posX + windowsWidth, posY + y + cornerSize)
                line(posX + x - cornerSize, posY, posX + x + cornerSize, posY)
                line(posX + x - cornerSize, posY + windowsHeight, posX + x + cornerSize, posY + windowsHeight)

                for (let p = 0; p < 2; p += 0.5) {
                    arc(posX + x, posY + y, radio, radio, PI * p - 0.08 * PI, PI * p + 0.08 * PI);
                }
            }
            fill(255, 80);
            noStroke()
            text(round(x + posX) + ',' + round(y + posY), x + posX, y + posY)
        }
    }

}


//创建一个长度为400的数组
let lineArray = [{ lengthRatio: 1 }];


function windowRecord(windowProp, recordData) {


    let ratio = 2;

    lineArray[recordData.length - 1] = { lengthRatio: 0 };

    for (i = 0; i < recordData.length - 1; i++) {
        posX = i * 2 % windowProp.width + windowProp.posX;
        posY = windowProp.height / 2 + windowProp.posY;

        let length0 = (recordData[i].inBottom.y - recordData[i].inTop.y) * windowProp.height * ratio * lineArray[i].lengthRatio


        let length1 = (recordData[i].inTop.y - recordData[i].outTop.y) * windowProp.height * ratio * lineArray[i].lengthRatio
        let length2 = (recordData[i].outBottom.y - recordData[i].inBottom.y) * windowProp.height * ratio * lineArray[i].lengthRatio

        //let weight = (recordData[i].right.x - recordData[i].left.x) * ratio * lineArray[i].lengthRatio * 1000 - 100
        //console.log(length)
        //strokeWeight(weight / 255)
        stroke(255, 80)


        line(posX, posY - length0 / 2 - length1, posX, posY - length0 / 2)
        //line(posX, posY - length0 / 2, posX, posY + length0 / 2);
        line(posX, posY + length0 / 2, posX, posY + length0 / 2 + length2);



    }


    gsap.to(lineArray[recordData.length - 1], {
        duration: 0.5,
        lengthRatio: 1,
        ease: "expo.out",
    })
    //console.log(lineArray[recordData.length - 1].lengthRatio)

    //if (isRecording) {
    fill(255, 4)
    noStroke()
    rect(windowProp.posX, windowProp.posY, (recordData.length - 1) * 2 % windowProp.width, windowProp.height)
    //}
}


let mouseProp = {
    isPressed: false,
    posX0: 0,
    posY0: 0,
    posX1: 0,
    posY1: 0,
    windowWidth: 0,
    windowHeight: 0,
}
