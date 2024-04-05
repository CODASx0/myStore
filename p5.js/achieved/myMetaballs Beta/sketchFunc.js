function drawSketchPoint(W, H, Z) {
    for (let z = 0; z < Z; z++) {
        //把第 Z 类圆形的数值叠加后计算出来
        for (let i = 0; i < W + 1; i++) {
            for (let j = 0; j < H + 1; j++) {
                //储存到圆心距离的倒数
                inputValue[i][j][z] = circleArray[z][0].r / sqrt(sq(circleArray[z][0].x - i * dpr) + sq(circleArray[z][0].y - j * dpr));
                for (let n = 1; n < circleArray[z].length; n++) {
                    let dt = circleArray[z][n].r / sqrt(sq(circleArray[z][n].x - i * dpr) + sq(circleArray[z][n].y - j * dpr));
                    inputValue[i][j][z] += dt * dt ;
                }
            }
        }

        if (z == 0) {
            for (let i = 0; i < W; i++) {
                for (let j = 0; j < H; j++) {
                    var nw = inputValue[i][j][z];
                    var ne = inputValue[i + 1][j][z];
                    var se = inputValue[i + 1][j + 1][z];
                    var sw = inputValue[i][j + 1][z];
                    var a = [i * dpr + dpr * myLerp(lim * circleLim[z], nw, ne), j * dpr];
                    var b = [
                        i * dpr + dpr,
                        j * dpr + dpr * myLerp(lim * circleLim[z], ne, se)
                    ];
                    var c = [
                        i * dpr + dpr * myLerp(lim * circleLim[z], sw, se),
                        j * dpr + dpr
                    ];
                    var d = [i * dpr, j * dpr + dpr * myLerp(lim * circleLim[z], nw, sw)];

                    gridValue[i][j][z] = binaryToType(
                        inputValue[i][j][z] > lim * circleLim[z],
                        inputValue[i + 1][j][z] > lim * circleLim[z],
                        inputValue[i + 1][j + 1][z] > lim * circleLim[z],
                        inputValue[i][j + 1][z] > lim * circleLim[z]
                    )


                    noStroke();
                    //stroke(250);
                    strokeWeight(3);
                    //noFill();
                    fill(255, 255);
                    //fill(246, 243, 243, 255);
                    //绘制 Metaballs

                    switch (gridValue[i][j][z]) {
                        case 1:
                        case 14:
                            if (inputValue[i][j + 1][z] > lim * circleLim[z]) {
                                triangle(d[0], d[1], c[0], c[1], d[0], c[1]);
                            } else {
                                beginShape();
                                vertex(d[0], d[1]);
                                vertex(c[0], c[1]);
                                vertex(b[0], c[1]);
                                vertex(b[0], a[1]);
                                vertex(d[0], a[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 2:
                        case 13:
                            if (inputValue[i + 1][j + 1][z] > lim * circleLim[z]) {
                                triangle(b[0], b[1], c[0], c[1], b[0], c[1])
                            } else {
                                beginShape();
                                vertex(b[0], b[1]);
                                vertex(c[0], c[1]);
                                vertex(d[0], c[1]);
                                vertex(d[0], a[1]);
                                vertex(b[0], a[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 3:
                        case 12:
                            if (inputValue[i][j][z] > lim * circleLim[z]) {
                                beginShape();
                                vertex(d[0], a[1]);
                                vertex(b[0], a[1]);
                                vertex(b[0], b[1]);
                                vertex(d[0], d[1]);
                                endShape(CLOSE);
                            } else {
                                beginShape();
                                vertex(d[0], c[1]);
                                vertex(b[0], c[1]);
                                vertex(b[0], b[1]);
                                vertex(d[0], d[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 11:
                        case 4:
                            if (inputValue[i + 1][j][z] > lim * circleLim[z]) {
                                triangle(a[0], a[1], b[0], b[1], b[0], a[1]);
                            } else {
                                beginShape();
                                vertex(a[0], a[1]);
                                vertex(b[0], b[1]);
                                vertex(b[0], c[1]);
                                vertex(d[0], c[1]);
                                vertex(d[0], a[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 5:
                            if (inputValue[i][j][z] > lim * circleLim[z]) {
                                beginShape(TRIANGLES);
                                vertex(d[0], a[1]);
                                vertex(a[0], a[1]);
                                vertex(d[0], d[1]);
                                vertex(b[0], b[1]);
                                vertex(c[0], c[1]);
                                vertex(b[0], c[1]);
                                endShape();
                            } else {
                                beginShape();
                                vertex(d[0], d[1]);
                                vertex(a[0], a[1]);
                                vertex(b[0], a[1]);
                                vertex(b[0], b[1]);
                                vertex(c[0], c[1]);
                                vertex(d[0], c[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 6:
                        case 9:
                            if (inputValue[i][j][z] > lim * circleLim[z]) {
                                beginShape();
                                vertex(d[0], a[1]);
                                vertex(a[0], a[1]);
                                vertex(c[0], c[1]);
                                vertex(d[0], c[1]);
                                endShape(CLOSE);
                            } else {
                                beginShape();
                                vertex(b[0], a[1]);
                                vertex(a[0], a[1]);
                                vertex(c[0], c[1]);
                                vertex(b[0], c[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 7:
                        case 8:
                            if (inputValue[i][j][z] > lim * circleLim[z]) {
                                triangle(d[0], a[1], a[0], a[1], d[0], d[1]);
                            } else {
                                beginShape();
                                vertex(d[0], d[1]);
                                vertex(a[0], a[1]);
                                vertex(b[0], a[1]);
                                vertex(b[0], c[1]);
                                vertex(d[0], c[1]);
                                endShape(CLOSE);
                            }
                            break;
                        case 10:
                            if (inputValue[i][j][z] > lim * circleLim[z]) {
                                beginShape();
                                vertex(d[0], a[1]);
                                vertex(a[0], a[1]);
                                vertex(b[0], b[1]);
                                vertex(b[0], c[1]);
                                vertex(c[0], c[1]);
                                vertex(d[0], d[1]);
                                endShape(CLOSE);
                            } else {
                                beginShape(TRIANGLES);
                                vertex(a[0], a[1]);
                                vertex(b[0], b[1]);
                                vertex(b[0], a[1]);
                                vertex(d[0], c[1]);
                                vertex(d[0], c[1]);
                                endShape();
                            }
                            break;
                        case 15:
                            rect(d[0], a[1], dpr, dpr);
                        default:
                            break;
                    }

                    if (displayMode == 1) {
                        stroke(200);
                        switch (gridValue[i][j][z]) {
                            case 1:
                            case 14:
                                line(d[0], d[1], c[0], c[1]);
                                break;
                            case 2:
                            case 13:
                                line(b[0], b[1], c[0], c[1]);
                                break;
                            case 3:
                            case 12:
                                line(d[0], d[1], b[0], b[1]);
                                break;
                            case 11:
                            case 4:
                                line(a[0], a[1], b[0], b[1]);
                                break;
                            case 5:
                                line(d[0], d[1], a[0], a[1]);
                                line(c[0], c[1], b[0], b[1]);
                                break;
                            case 6:
                            case 9:
                                line(c[0], c[1], a[0], a[1]);
                                break;
                            case 7:
                            case 8:
                                line(d[0], d[1], a[0], a[1]);
                                break;
                            case 10:
                                line(a[0], a[1], b[0], b[1]);
                                line(c[0], c[1], d[0], d[1]);
                                break;
                            case 15:
                            default:
                                break;
                        }
                    }

                }
            }
        } else if (z == 1) {
            noFill();
            for (n = 1; n < circleArray[z].length; n++) {
                stroke(0, 0, 0, 20);
                fill(255, 255);
                ellipse(circleArray[z][n].x, circleArray[z][n].y, circleArray[z][n].r / (lim * circleLim[z]), circleArray[z][n].r / (lim * circleLim[z]))
            }
            stroke("#ECCCCC");
            fill(255, 255);
            ellipse(circleArray[z][0].x, circleArray[z][0].y, circleArray[z][0].r / (lim * circleLim[z]), circleArray[z][0].r / (lim * circleLim[z]))
        }
    }
}