//设置精度
let dpr = 20;
//画布上出现的第一类圆型
let circle0 = [];
//初始化几个后面会用到的参数
let xNum = 0;
let yNum = 0;
//屏幕上显示的点阵
let pointVolume = [];

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
			pointVolume[i + j * i] = circle0[0].r / sqrt(sq(circle0[0].x - i * dpr) + sq(circle0[0].y - j * dpr));
			for (let n = 1; n < circle0.length; n++) {
				pointVolume[i + j * i] += circle0[n].r / sqrt(sq(circle0[n].x - i * dpr) + sq(circle0[n].y - j * dpr));
			}
			noStroke();

			fill(100, 200, 200, 255);

			ellipse(i * dpr, j * dpr, pointVolume[i + j * i], pointVolume[i + j * i]);
		}
	}

}

function setup() {
	createCanvas(1600, 800);
	xNum = parseInt(width / dpr);
	yNum = parseInt(height / dpr);

	circle0[1] = new circleDraw(300, 200, 100);
	circle0[2] = new circleDraw(600, 200, 100);
	circle0[3] = new circleDraw(900, 200, 100);
	circle0[4] = new circleDraw(1200, 200, 100);
	circle0[5] = new circleDraw(900, 400, 100);
	circle0[6] = new circleDraw(1200, 400, 100);

}

function draw() {
	background(0, 0, 0);
	//点阵初始化
	circle0[0] = new circleDraw(mouseX, mouseY, 100);
	pointVolume = []
	drawSketchPoint(xNum, yNum);

}