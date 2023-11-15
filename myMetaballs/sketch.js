//设置精度
let dpr = 12;

//设置全局阈值，相当于统一调整半径，非必要不调整
let lim = 1;


//初始化画布的宽、高、图层数量
let xNum = 0;
let yNum = 0;
let zNum = 1;
let circleLim = new Array(zNum);

//初始化不同图层上的圆
circleArray = new Array(zNum);
for (z = 0; z < zNum; z++) {
	circleArray[z] = new Array();
}

//定义画布
let canvas;

//定义类：画在上面的圆
class circleDraw {
	constructor(posX, posY, radius,speed) {
		this.x = posX;
		this.y = posY;
		this.r = radius;
		this.s = speed;
	}
	update() {
		this.x += (mouseX - this.x) * this.s;
		this.y += (mouseY - this.y) * this.s;
	}
}

//把点阵上的数值计算后视觉化呈现出来
function drawSketchPoint(W, H, Z) {
	for (let z = 0; z < Z; z++) {

		//把第 Z 类圆形的数值叠加后计算出来
		for (let i = 0; i < W + 1; i++) {
			for (let j = 0; j < H + 1; j++) {
				//储存到圆心距离的倒数
				inputValue[i][j][z] = circleArray[z][0].r / sqrt(sq(circleArray[z][0].x - i * dpr) + sq(circleArray[z][0].y - j * dpr));
				for (let n = 1; n < circleArray[z].length; n++) {
					inputValue[i][j][z] += circleArray[z][n].r / sqrt(sq(circleArray[z][n].x - i * dpr) + sq(circleArray[z][n].y - j * dpr));
				}
			}
		}



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
				//stroke(0);
				fill("#F7F4F4");
				//绘制 Metaballs
				switch (gridValue[i][j][z]) {
					case 1:
					case 14:
						//line(d[0], d[1], c[0], c[1]);
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
						//line(b[0], b[1], c[0], c[1]);
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
						//line(d[0], d[1], b[0], b[1]);
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
						//line(a[0], a[1], b[0], b[1]);
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
						//line(d[0], d[1], a[0], a[1]);
						//line(c[0], c[1], b[0], b[1]);
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
						//line(c[0], c[1], a[0], a[1]);
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
						//line(d[0], d[1], a[0], a[1]);
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
						//line(a[0], a[1], b[0], b[1]);
						//line(c[0], c[1], d[0], d[1]);
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

			}
		}
	}

}

function myLerp(x, x0, x1, y0 = 0, y1 = 1) {
	if (x0 === x1) {
		return null;
	}

	return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function binaryToType(nw, ne, se, sw) {
	a = [nw, ne, se, sw];
	return a.reduce((res, x) => (res << 1) | x);
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;

	circleLim[0] = 2;
	
	circleArray[0][0] = new circleDraw(width * 0.65, height * 0.5, 50,0.2);
	circleArray[0][1] = new circleDraw(width * 0.5, height * 0.5, 50,0.03);
	circleArray[0][2] = new circleDraw(width * 0.35, height * 0.5, 50, 0.06);
	

}

function draw() {
	//动态响应
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;
	zNum = 1;//限定显示的图层数量


	//动态初始化三维数组
	inputValue = new Array(xNum + 1);
	gridValue = new Array(xNum + 1);
	for (let i = 0; i <= xNum; i++) {
		inputValue[i] = new Array(yNum + 1);
		gridValue[i] = new Array(yNum + 1);
		for (let j = 0; j <= yNum; j++) {
			inputValue[i][j] = new Array(zNum);
			gridValue[i][j] = new Array(zNum);
		}
	}
	background(255);

	//动态写入圆的属性

	//circleArray[0][0].update();
	for (i = 0; i < circleArray.length; i++) {
		for (j = 0; j < circleArray[i].length; j++) {
			circleArray[i][j].update();
		}
	}
	drawSketchPoint(xNum, yNum, zNum);

}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

