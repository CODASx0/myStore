//设置精度
let dpr = 10;
//画布上出现的第一类圆型
let circle0 = [];


//let fillCol0 = color('rgb(0,0,200)');
//let strokeCol0 = color('rgb(0,0,20)');


//初始化几个后面会用到的参数
let xNum = 0;
let yNum = 0;

//设置全局阈值，相当于统一调整半径，非必要不调整
let lim = 1;
//定义画布
let canvas;

//定义类：画在上面的圆
class circleDraw {
	constructor(posX, posY, radius) {
		this.x = posX;
		this.y = posY;
		this.r = radius;
	}
}

//把点阵上的数值计算后视觉化呈现出来
function drawSketchPoint(W, H) {
	//把第一类圆形的数值叠加后计算出来
	for (let i = 0; i < W + 1; i++) {
		for (let j = 0; j < H + 1; j++) {
			//储存到圆心距离的倒数
			inputValue[i][j] = circle0[0].r / sqrt(sq(circle0[0].x - i * dpr) + sq(circle0[0].y - j * dpr));
			for (let n = 1; n < circle0.length; n++) {
				inputValue[i][j] += circle0[n].r / sqrt(sq(circle0[n].x - i * dpr) + sq(circle0[n].y - j * dpr));
			}
		}
	}



	for (let i = 0; i < W; i++) {
		for (let j = 0; j < H; j++) {

			var nw = inputValue[i][j];
			var ne = inputValue[i + 1][j];
			var se = inputValue[i + 1][j + 1];
			var sw = inputValue[i][j + 1];
			var a = [i * dpr + dpr * myLerp(lim, nw, ne), j * dpr];
			var b = [
				i * dpr + dpr,
				j * dpr + dpr * myLerp(lim, ne, se)
			];
			var c = [
				i * dpr + dpr * myLerp(lim, sw, se),
				j * dpr + dpr
			];
			var d = [i * dpr, j * dpr + dpr * myLerp(lim, nw, sw)];

			/*noStroke();
			fill(inputValue[i][j] * 100);
			ellipse(i * dpr, j * dpr, dpr, dpr);*/

			gridValue[i][j] = binaryToType(
				inputValue[i][j] > lim,
				inputValue[i + 1][j] > lim,
				inputValue[i + 1][j + 1] > lim,
				inputValue[i][j + 1] > lim
			)

			//gridValue[i][j] 

			stroke(200);
			switch (gridValue[i][j]) {
				case 1:
				case 14:
					//noStroke();
					//fill(fillCol0);
					//triangle(d[0], d[1], c[0], c[1], d[0], c[1]);
					//stroke(strokeCol0);
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
				default:
					break;
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

}

function draw() {
	//动态响应
	xNum = width / dpr | 0;
	yNum = height / dpr | 0;
	//动态初始化二维数组
	inputValue = new Array(xNum + 1);
	gridValue = new Array(xNum + 1);
	for (let i = 0; i <= xNum; i++) {
		inputValue[i] = new Array(yNum + 1);
		gridValue[i] = new Array(yNum + 1);
	}
	background(0, 0, 0);

	circle0[1] = new circleDraw(width * 0.5, height * 0.5, 60);
	circle0[0] = new circleDraw(mouseX, mouseY, 60);

	drawSketchPoint(xNum, yNum);

}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }