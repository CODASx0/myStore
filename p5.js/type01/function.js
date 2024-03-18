//创建像素字符字典


function drawMesh(key, posX, posY, wid, hei,radio) {
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
        rect(x1, y1, x3 - x1, y3 - y1,radio,radio,radio,radio);
        console.log(x1, y1, x3 - x1, y3 - y1)


    }
    let widSum;
    for(let i = 0;i<wid.length;i++){
        widSum += wid[i]
    }
    
    return widSum
}